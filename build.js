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
    items.push(`<span class="blog-category" onclick="filterByCategory('${post.category}'); event.stopPropagation();" title="Category: ${post.category}">${post.category}</span>`);
  }
  
  if (post.tags && post.tags.length > 0) {
    const tags = post.tags.map(tag => 
      `<span class="blog-tag" onclick="filterByTag('${tag}'); event.stopPropagation();" title="Tag: ${tag}">${tag}</span>`
    ).join(' • ');
    items.push(tags);
  }
  
  return items.length > 0 ? `<div class="blog-meta-tags">${items.join(' / ')}</div>` : '';
}

function generateBlogArchive(posts) {
  if (posts.length === 0) {
    return `
      <div class="content">
        <h1>Creative Journal</h1>
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
      <h1>Creative Journal</h1>
      <div style="margin-bottom: 40px;">
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
          Reflections on contemplative practice, the creative process, and the emergence of poetry from stillness.
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
          ← Back to Journal
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
  
  // Remove ALL existing journal/blog content completely - start fresh each time
  // This removes everything from first journal/blog comment to Contact Page
  const journalContentRegex = /\s*<!-- Journal Archive Page -->[\s\S]*?(?=\s*<!-- Contact Page -->)/g;
  html = html.replace(journalContentRegex, '');
  
  // Also remove any individual blog post pages that might exist after Contact Page
  const blogPostRegex = /\s*<!-- Journal Post:[\s\S]*?(?=\s*<\/main>|\s*<!-- |$)/g;
  html = html.replace(blogPostRegex, '');
  
  // Generate blog content
  const blogArchive = generateBlogArchive(posts);
  const blogPosts = posts.map(post => generateBlogPost(post));
  
  // Ensure we have exactly one journal navigation item
  // First remove any existing blog and duplicate journal links
  html = html.replace(/<li><a href="#blog" class="nav-link">blog<\/a><\/li>\s*/g, '');
  
  // Remove any existing journal links first
  html = html.replace(/<li><a href="#journal" class="nav-link">journal<\/a><\/li>\s*/g, '');
  
  // Then add exactly one journal link after philosophy
  const navRegex = /(<li><a href="#philosophy" class="nav-link">philosophy<\/a><\/li>)/;
  html = html.replace(navRegex, '$1\n          <li><a href="#journal" class="nav-link">journal</a></li>');
  
  // Find where to insert journal content (before Contact Page)
  const insertPoint = html.indexOf('        <!-- Contact Page -->');
  if (insertPoint === -1) {
    console.error('Could not find insertion point for journal content');
    return;
  }
  
  // Only add journal content if we have posts or want to show empty journal
  let journalContent = '';
  
  // Create journal archive page
  journalContent += `
        <!-- Journal Archive Page -->
        <div id="journal" class="page">
          ${blogArchive}
        </div>

`;
  
  // Create individual journal post pages (only if posts exist)
  if (posts.length > 0) {
    const journalPostPages = posts.map(post => `
        <!-- Journal Post: ${post.title} -->
        <div id="blog-${post.slug}" class="page">
          ${generateBlogPost(post)}
        </div>
`).join('');
    journalContent += journalPostPages;
  }
  
  // Insert journal content before Contact Page
  html = html.slice(0, insertPoint) + journalContent + html.slice(insertPoint);
  
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
        display: inline-block;
        margin-right: 16px;
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

  // Remove ALL existing blog JavaScript 
  while (html.includes('// Blog filtering functions')) {
    const startIndex = html.indexOf('// Blog filtering functions');
    const endIndex = html.indexOf('window.addEventListener(\'hashchange\', handleInitialRoute);', startIndex);
    if (endIndex === -1) {
      // Try to find popstate version
      const popstateEnd = html.indexOf('window.addEventListener(\'popstate\', handleInitialRoute);', startIndex);
      if (popstateEnd !== -1) {
        html = html.substring(0, startIndex) + html.substring(popstateEnd + 'window.addEventListener(\'popstate\', handleInitialRoute);'.length);
      } else {
        break; // Safety exit
      }
    } else {
      html = html.substring(0, startIndex) + html.substring(endIndex + 'window.addEventListener(\'hashchange\', handleInitialRoute);'.length);
    }
  }
  
  // Add blog routing JavaScript before the closing script tag
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
    
    // Update URL using hash-based routing with query params
    window.location.hash = 'journal?category=' + encodeURIComponent(category);
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
    
    // Update URL using hash-based routing with query params
    window.location.hash = 'journal?tag=' + encodeURIComponent(tag);
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
    
    // Update URL using hash-based routing
    window.location.hash = 'journal';
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
      // Update URL using hash-based routing for GitHub Pages compatibility
      window.location.hash = 'blog-' + slug;
    }
  };
  
  window.showBlogArchive = function() {
    // Remove active from all
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Show journal archive and activate nav
    document.querySelector('.nav-link[href="#journal"]').classList.add('active');
    document.getElementById('journal').classList.add('active');
    
    // Update URL using hash-based routing
    window.location.hash = 'journal';
  };
  
  // Handle initial page load based on URL
  function handleInitialRoute() {
    const hash = window.location.hash.substring(1) || 'home';
    
    // Handle blog post routes like #blog-post-slug
    if (hash.startsWith('blog-')) {
      const slug = hash.replace('blog-', '');
      if (document.getElementById('blog-' + slug)) {
        showBlogPost(slug);
        return;
      }
    }
    
    // Handle journal routes like #journal or #journal?category=Politics
    if (hash.startsWith('journal')) {
      const [route, queryString] = hash.split('?');
      showBlogArchive();
      
      // Handle category/tag filtering from URL
      if (queryString) {
        const params = new URLSearchParams(queryString);
        if (params.get('category')) {
          setTimeout(() => filterByCategory(params.get('category')), 100);
        } else if (params.get('tag')) {
          setTimeout(() => filterByTag(params.get('tag')), 100);
        }
      }
      return;
    }
    
    // Default behavior for other routes
    const targetPage = hash;
    if (document.getElementById(targetPage)) {
      document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
      
      document.querySelector(\`.nav-link[href="#\${hash}"]\`)?.classList.add('active');
      document.getElementById(targetPage).classList.add('active');
    }
  }
  
  // Call on load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInitialRoute);
  } else {
    handleInitialRoute();
  }
  
  // Handle browser back/forward and hash changes
  window.addEventListener('hashchange', handleInitialRoute);
$1`;
  
  html = html.replace(scriptEndRegex, blogJs);
  
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