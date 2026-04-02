/* Blog post rendering */
var blogPosts = [
  { title: "Designing ML systems that don't fail in production", description: "Senior-level strategies for robust, production-ready machine learning systems.", href: "docs/blog/2026/ml-production.html", date: "2026-01-01", category: "ML Engineering" },
  { title: "MLOps lessons learned shipping real models", description: "Key operational insights, monitoring strategies, and deployment lessons from production ML.", href: "docs/blog/2026/mlops-lessons.html", date: "2026-01-02", category: "MLOps" },
  { title: "Transformers, KV Caching, and Scaling LLMs", description: "Deep dive into transformer internals, KV caching, and production optimizations.", href: "docs/blog/2026/transformers-kv-caching.html", date: "2026-01-03", category: "LLM Engineering" },
  { title: "Serving PyTorch Models with Rust", description: "High-performance, memory-safe ML serving using Rust and TorchScript.", href: "docs/blog/2026/rust-torch-serving.html", date: "2026-01-04", category: "ML Production" }
];

var gridB = document.getElementById('blogGrid');
if (gridB) {
  blogPosts.forEach(function (post) {
    var card = document.createElement('a');
    card.href = post.href;
    card.className = 'blog-card';
    card.innerHTML = '<div class="blog-meta">' + post.date + ' \u00B7 ' + post.category + '</div><h3>' + post.title + '</h3><p>' + post.description + '</p><span>Read \u2192</span>';
    gridB.appendChild(card);
  });
}
