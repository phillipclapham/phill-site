const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configure marked for our terminal aesthetic
marked.setOptions({
  breaks: true,
  gfm: true
});

// Custom renderer to match our CSS classes
const renderer = new marked.Renderer();
renderer.heading = function(text, level) {
  return `<h${level}>${text}</h${level}>\n`;
};
renderer.paragraph = function(text) {
  return `<p>${text}</p>\n`;
};
renderer.blockquote = function(quote) {
  return `<blockquote>${quote}</blockquote>\n`;
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readPosts() {
  const postsDir = path.join(__dirname, 'posts');
  const posts = [];

  try {
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data: frontmatter, content: markdown } = matter(content);
      
      // Generate slug from filename if not provided
      const slug = frontmatter.slug || slugify(path.basename(file, '.md'));
      
      // Default values
      const post = {
        slug,
        title: frontmatter.title || path.basename(file, '.md').replace(/_/g, ' '),
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        excerpt: frontmatter.excerpt || '',
        category: frontmatter.category || '',
        tags: frontmatter.tags || [],
        content: marked(markdown, { renderer }),
        filename: file
      };
      
      posts.push(post);
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return posts;
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

function generateCategoryTags(post) {
  const items = [];
  
  if (post.category) {
    items.push(`<span class="blog-category" onclick="filterByCategory('${post.category}')" title="Category: ${post.category}">${post.category}</span>`);
  }
  
  if (post.tags && post.tags.length > 0) {
    const tags = post.tags.map(tag => 
      `<span class="blog-tag" onclick="filterByTag('${tag}')" title="Tag: ${tag}">${tag}</span>`
    ).join(' • ');
    items.push(tags);
  }
  
  return items.length > 0 ? `<div class="blog-meta-tags">${items.join(' / ')}</div>` : '';
}

function generateBlogArchive(posts) {
  if (posts.length === 0) {
    return `
      <div class="content">
        <h1>Blog</h1>
        <p>No posts yet. Check back soon!</p>
      </div>
    `;
  }

  // Extract unique categories from posts
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))].sort();
  
  // Generate category navigation
  const categoryNav = categories.length > 0 ? `
    <div class="blog-category-nav">
      <span class="category-nav-item active" onclick="clearFilter()">All</span>
      ${categories.map(category => 
        `<span class="category-nav-item" onclick="filterByCategory('${category}')">${category}</span>`
      ).join('')}
    </div>
  ` : '';

  const postList = posts.map(post => `
    <div class="experience-item blog-post-item" style="cursor: pointer;" onclick="showBlogPost('${post.slug}')" data-category="${post.category}" data-tags="${post.tags.join(',')}">
      <h3 style="color: var(--accent-green); margin-bottom: 10px;">
        ${post.title}
      </h3>
      <div class="experience-meta" style="margin-bottom: 10px;">
        ${formatDate(post.date)}
      </div>
      ${generateCategoryTags(post)}
      ${post.excerpt ? `<p style="color: var(--text-secondary); margin-top: 15px;">${post.excerpt}</p>` : ''}
    </div>
  `).join('');

  return `
    <div class="content">
      <h1>Blog</h1>
      <div style="margin-bottom: 40px;">
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
          Thoughts on technology, consciousness, and the spaces between.
        </p>
        ${categoryNav}
        <div id="blog-filters" style="display: none;">
          <span style="color: var(--text-secondary); font-size: 12px;">Filtering: </span>
          <span id="active-filter" style="color: var(--accent-amber);"></span>
          <span style="color: var(--text-secondary); cursor: pointer; margin-left: 10px;" onclick="clearFilter()">✕ clear</span>
        </div>
      </div>
      <div id="blog-posts">
        ${postList}
      </div>
    </div>
  `;
}

function generateBlogPost(post) {
  return `
    <div class="content">
      <div style="margin-bottom: 20px;">
        <span style="color: var(--text-secondary); font-size: 12px; cursor: pointer;" onclick="showBlogArchive()">
          ← Back to Blog
        </span>
      </div>
      <h1>${post.title}</h1>
      <div style="color: var(--text-secondary); margin-bottom: 30px; font-size: 13px;">
        ${formatDate(post.date)}
      </div>
      ${post.content}
    </div>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function updateIndexHtml(posts) {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Remove existing blog content (everything between "<!-- Blog Archive Page -->" and "<!-- Contact Page -->")
  const blogStartRegex = /(\s*<!-- Blog Archive Page -->[\s\S]*?)<!-- Contact Page -->/;
  if (blogStartRegex.test(html)) {
    html = html.replace(blogStartRegex, '        <!-- Contact Page -->');
  }
  
  // Generate blog content
  const blogArchive = generateBlogArchive(posts);
  const blogPosts = posts.map(post => generateBlogPost(post));
  
  // Add blog navigation item after wu wei (only if not already present)
  if (!html.includes('href="#blog"')) {
    const navRegex = /(<li><a href="#wuwei" class="nav-link">無 為<\/a><\/li>)/;
    html = html.replace(navRegex, '$1\n          <li><a href="#blog" class="nav-link">blog</a></li>');
  }
  
  // Find where to insert blog content (after contact page, before main closing tag)
  const insertPoint = html.indexOf('        <!-- Contact Page -->');
  if (insertPoint === -1) {
    console.error('Could not find insertion point for blog content');
    return;
  }
  
  // Create blog archive page
  const blogArchivePage = `
        <!-- Blog Archive Page -->
        <div id="blog" class="page">
          ${blogArchive}
        </div>

`;
  
  // Create individual blog post pages
  const blogPostPages = posts.map(post => `
        <!-- Blog Post: ${post.title} -->
        <div id="blog-${post.slug}" class="page">
          ${generateBlogPost(post)}
        </div>
`).join('');
  
  // Insert blog content
  html = html.slice(0, insertPoint) + blogArchivePage + blogPostPages + html.slice(insertPoint);
  
  // Add blog CSS styles before closing </style> tag (only if not already present)
  if (!html.includes('/* Blog category and tag styles */')) {
    const cssEndRegex = /(\s*<\/style>)/;
    const blogCss = `
      /* Blog category and tag styles */
      .blog-meta-tags {
        font-size: 11px;
        margin-bottom: 10px;
      }
      
      .blog-category, .blog-tag {
        color: var(--accent-amber);
        cursor: pointer;
        transition: color 0.3s ease;
        text-decoration: none;
      }
      
      .blog-category:hover, .blog-tag:hover {
        color: var(--accent-green);
      }
      
      .blog-category {
        font-weight: 500;
      }
      
      .blog-tag {
        font-weight: 400;
      }
      
      #blog-filters {
        padding: 10px 0;
        border-bottom: 1px solid var(--border-dim);
        margin-bottom: 20px;
      }
      
      /* Category navigation styles */
      .blog-category-nav {
        margin-bottom: 25px;
        font-size: 13px;
      }
      
      .category-nav-item {
        color: var(--text-secondary);
        cursor: pointer;
        transition: color 0.3s ease;
        margin-right: 8px;
      }
      
      .category-nav-item:not(:last-child)::after {
        content: " • ";
        color: var(--text-dim);
        margin-left: 8px;
      }
      
      .category-nav-item:hover {
        color: var(--accent-amber);
      }
      
      .category-nav-item.active {
        color: var(--accent-amber);
      }
$1`;
    
    html = html.replace(cssEndRegex, blogCss);
  }

  // Add blog routing JavaScript before the closing script tag (only if not already present)
  if (!html.includes('window.filterByCategory')) {
    const scriptEndRegex = /(\s*<\/script>)/;
    const blogJs = `
  // Blog filtering functions
  window.filterByCategory = function(category) {
    const posts = document.querySelectorAll('.blog-post-item');
    const filters = document.getElementById('blog-filters');
    const activeFilter = document.getElementById('active-filter');
    const categoryNavItems = document.querySelectorAll('.category-nav-item');
    
    posts.forEach(post => {
      const postCategory = post.getAttribute('data-category');
      if (postCategory === category) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
    
    // Update category nav active states
    categoryNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.textContent === category) {
        item.classList.add('active');
      }
    });
    
    filters.style.display = 'block';
    activeFilter.textContent = 'Category: ' + category;
    
    // Update URL
    if (history.pushState) {
      history.pushState(null, null, '/blog?category=' + encodeURIComponent(category));
    }
  };
  
  window.filterByTag = function(tag) {
    const posts = document.querySelectorAll('.blog-post-item');
    const filters = document.getElementById('blog-filters');
    const activeFilter = document.getElementById('active-filter');
    const categoryNavItems = document.querySelectorAll('.category-nav-item');
    
    posts.forEach(post => {
      const postTags = post.getAttribute('data-tags').split(',');
      if (postTags.includes(tag)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
    
    // Reset category nav when filtering by tag
    categoryNavItems.forEach(item => {
      item.classList.remove('active');
    });
    
    filters.style.display = 'block';
    activeFilter.textContent = 'Tag: ' + tag;
    
    // Update URL
    if (history.pushState) {
      history.pushState(null, null, '/blog?tag=' + encodeURIComponent(tag));
    }
  };
  
  window.clearFilter = function() {
    const posts = document.querySelectorAll('.blog-post-item');
    const filters = document.getElementById('blog-filters');
    const categoryNavItems = document.querySelectorAll('.category-nav-item');
    
    posts.forEach(post => {
      post.style.display = 'block';
    });
    
    // Reset category nav to "All"
    categoryNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.textContent === 'All') {
        item.classList.add('active');
      }
    });
    
    filters.style.display = 'none';
    
    // Update URL
    if (history.pushState) {
      history.pushState(null, null, '/blog');
    }
  };

  // Blog routing functions (global scope)
  window.showBlogPost = function(slug) {
    // Remove active from all
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Show blog post
    const postPage = document.getElementById('blog-' + slug);
    if (postPage) {
      postPage.classList.add('active');
      // Update URL without page reload
      if (history.pushState) {
        history.pushState(null, null, '/blog/' + slug);
      }
    }
  };
  
  window.showBlogArchive = function() {
    // Remove active from all
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Show blog archive and activate nav
    document.querySelector('.nav-link[href="#blog"]').classList.add('active');
    document.getElementById('blog').classList.add('active');
    
    // Update URL
    if (history.pushState) {
      history.pushState(null, null, '/blog');
    }
  };
  
  // Handle initial page load based on URL
  function handleInitialRoute() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      if (document.getElementById('blog-' + slug)) {
        showBlogPost(slug);
        return;
      }
    } else if (path === '/blog') {
      showBlogArchive();
      
      // Handle category/tag filtering from URL
      if (params.get('category')) {
        setTimeout(() => filterByCategory(params.get('category')), 100);
      } else if (params.get('tag')) {
        setTimeout(() => filterByTag(params.get('tag')), 100);
      }
      return;
    }
    
    // Default behavior for other routes
    const hash = window.location.hash || '#home';
    const targetPage = hash.substring(1);
    if (document.getElementById(targetPage)) {
      document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
      
      document.querySelector(\`.nav-link[href="\${hash}"]\`)?.classList.add('active');
      document.getElementById(targetPage).classList.add('active');
    }
  }
  
  // Call on load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInitialRoute);
  } else {
    handleInitialRoute();
  }
  
  // Handle browser back/forward
  window.addEventListener('popstate', handleInitialRoute);
$1`;
    
    html = html.replace(scriptEndRegex, blogJs);
  }
  
  // Write updated HTML
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`✓ Built ${posts.length} blog posts`);
  posts.forEach(post => {
    console.log(`  - ${post.title} (/blog/${post.slug})`);
  });
}

function main() {
  console.log('Building blog...');
  
  const posts = readPosts();
  updateIndexHtml(posts);
  
  console.log('✓ Blog build complete!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { readPosts, updateIndexHtml };