import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Clock, User, ArrowLeft, Download, Share2, Instagram, MessageCircle, Twitter, MessageCircleCode } from 'lucide-react';
import { fetchBlogBySlug, fetchBlogs, type Blog } from '../services/blog';
import toast from 'react-hot-toast';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background">
    <Container className="py-8 sm:py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-amber mx-auto"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading article...</p>
      </div>
    </Container>
  </div>
);

const ErrorFallback = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-background">
    <Container className="py-8 sm:py-12">
      <div className="text-center text-red-500 text-sm sm:text-base">
        <p>{error || 'Blog post not found'}</p>
        <Button variant="outline" asChild className="mt-3 sm:mt-4 text-sm sm:text-base">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    </Container>
  </div>
);

const parseContent = (content: string) => {
  const lines = content.split('\n').map(line => line.trim());
  const elements: JSX.Element[] = [];
  let currentParagraph: string[] = [];
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  lines.forEach((line, index) => {
    if (!line) {
      if (currentParagraph.length) {
        elements.push(<p key={`p-${index}`} className="text-gray-700 text-sm sm:text-base leading-relaxed">{currentParagraph.join(' ')}</p>);
        currentParagraph = [];
      }
      if (currentList.length) {
        elements.push(
          listType === 'ul' ? (
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base text-gray-700">
              {currentList.map((item, i) => <li key={`li-${i}`}>{item}</li>)}
            </ul>
          ) : (
            <ol key={`ol-${index}`} className="list-decimal list-inside space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base text-gray-700">
              {currentList.map((item, i) => <li key={`li-${i}`}>{item}</li>)}
            </ol>
          )
        );
        currentList = [];
        listType = null;
      }
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index}`} className="font-display font-bold text-2xl sm:text-3xl lg:text-h2 text-egyptian-blue mt-8 sm:mt-10 mb-4 sm:mb-6">
          {line.replace('## ', '')}
        </h2>
      );
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index}`} className="font-display font-semibold text-xl sm:text-2xl lg:text-h3 text-egyptian-blue mt-6 sm:mt-8 mb-3 sm:mb-4">
          {line.replace('### ', '')}
        </h3>
      );
      return;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (listType !== 'ul') {
        if (currentList.length) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base text-gray-700">
              {currentList.map((item, i) => <li key={`li-${i}`}>{item}</li>)}
            </ul>
          );
          currentList = [];
        }
        listType = 'ul';
      }
      currentList.push(line.replace(/^- |\* /, ''));
      return;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (listType !== 'ol') {
        if (currentList.length) {
          elements.push(
            <ol key={`ol-${index}`} className="list-decimal list-inside space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base text-gray-700">
              {currentList.map((item, i) => <li key={`li-${i}`}>{item}</li>)}
            </ol>
          );
          currentList = [];
        }
        listType = 'ol';
      }
      currentList.push(line.replace(/^\d+\.\s+/, ''));
      return;
    }

    if (line.match(/\*\*.*?\*\*/)) {
      elements.push(
        <p key={`bold-${index}`} className="font-semibold text-sm sm:text-base text-eerie-black leading-relaxed">
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      );
      return;
    }

    if (line.trim() === '---') {
      elements.push(<Separator key={`sep-${index}`} className="my-6 sm:my-8" />);
      return;
    }

    currentParagraph.push(line);
  });

  if (currentParagraph.length) {
    elements.push(<p key="p-final" className="text-gray-700 text-sm sm:text-base leading-relaxed">{currentParagraph.join(' ')}</p>);
  }
  if (currentList.length) {
    elements.push(
      listType === 'ul' ? (
        <ul key="ul-final" className="list-disc list-inside space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base text-gray-700">
          {currentList.map((item, i) => <li key={`li-${i}`}>{item}</li>)}
        </ul>
      ) : (
        <ol key="ol-final" className="list-decimal list-inside space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base text-gray-700">
          {currentList.map((item, i) => <li key={`li-${i}`}>{item}</li>)}
        </ol>
      )
    );
  }

  return elements;
};

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: relatedPosts, isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedBlogs', slug],
    queryFn: () => fetchBlogs(undefined, undefined, 10, post?.slug),
    enabled: !!post,
    select: (blogs) => blogs.sort(() => 0.5 - Math.random()).slice(0, 3),
    staleTime: 5 * 60 * 1000,
  });

  const parsedContent = useMemo(() => (post ? parseContent(post.content) : []), [post?.content]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
      } catch (err) {
        console.error('Web Share API failed:', err);
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast.success('Link copied to clipboard!', { duration: 3000 });
        });
      }
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Link copied to clipboard!', { duration: 3000 });
      });
    }
  };

  const handleInstagramShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied! Paste it in your Instagram Story or post.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }).catch(() => {
      toast.error('Failed to copy link.', {
        duration: 3000,
        position: 'bottom-center',
      });
    });
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://api.whatsapp.com/send?text=${encodedUrl}`, '_blank');
  };

  const handleTwitterShare = () => {
    const shareUrl = window.location.href;
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank');
  };

  if (postLoading || relatedLoading) return <LoadingSpinner />;
  if (postError || !post) return <ErrorFallback error={postError?.message || 'Blog post not found'} />;

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title || 'Blog Post | Gajpati Industries'}</title>
        <meta
          name="description"
          content={post.seoDescription || post.excerpt || 'Read expert insights and technical guides from Gajpati Industries.'}
        />
        <meta name="keywords" content={post.seoKeywords?.join(', ') || 'infrastructure chemicals, technical guides, Gajpati Industries'} />
        <meta property="og:title" content={post.seoTitle || post.title || 'Blog Post | Gajpati Industries'} />
        <meta
          property="og:description"
          content={post.seoDescription || post.excerpt || 'Read expert insights and technical guides from Gajpati Industries.'}
        />
        <meta property="og:image" content={post.image || 'https://yourdomain.com/images/blog-og.jpg'} />
        <meta property="og:url" content={`https://yourdomain.com/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seoTitle || post.title || 'Blog Post | Gajpati Industries'} />
        <meta
          name="twitter:description"
          content={post.seoDescription || post.excerpt || 'Read expert insights and technical guides from Gajpati Industries.'}
        />
        <meta name="twitter:image" content={post.image || 'https://yourdomain.com/images/blog-og.jpg'} />
        <link rel="canonical" href={`https://yourdomain.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.seoDescription || post.excerpt,
            'image': post.image || 'https://yourdomain.com/images/blog-og.jpg',
            'author': { '@type': 'Person', 'name': post.author },
            'datePublished': post.createdAt,
            'dateModified': post.updatedAt,
            'publisher': {
              '@type': 'Organization',
              'name': 'Gajpati Industries',
              'logo': { '@type': 'ImageObject', 'url': 'https://yourdomain.com/images/logo.png' },
            },
            'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://yourdomain.com/blog/${post.slug}` },
            'keywords': post.seoKeywords || post.tags,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://yourdomain.com' },
              { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://yourdomain.com/blog' },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': post.title.substring(0, 30),
                'item': `https://yourdomain.com/blog/${post.slug}`,
              },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-platinum/30 py-3 sm:py-4">
          <Container>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 flex-wrap">
              <Link to="/blog" className="hover:text-egyptian-blue">Blog</Link>
              <span className="mx-1 sm:mx-2">/</span>
              <span>{post.category}</span>
              <span className="mx-1 sm:mx-2">/</span>
              <span className="text-egyptian-blue">{post.title.substring(0, 30)}...</span>
            </div>
          </Container>
        </div>

        {/* Article Header */}
        <article className="py-8 sm:py-12" aria-labelledby="article-heading">
          <Container>
            <Button asChild variant="ghost" className="mb-4 sm:mb-6 text-sm sm:text-base p-0 h-auto justify-start">
              <Link to="/blog" aria-label="Back to blog listing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {post.image ? (
              <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={`${post.image}?format=webp&quality=80`}
                  alt={`Featured image for blog post: ${post.title}`}
                  className="w-full h-64 sm:h-[400px] lg:h-[500px] object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x500?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 text-white text-xs sm:text-sm font-semibold">
                  {post.category}
                </div>
              </div>
            ) : (
              <div className="mb-6 sm:mb-8 h-64 sm:h-[400px] lg:h-[500px] bg-gradient-to-br from-egyptian-blue to-violet-blue flex items-center justify-center rounded-xl shadow-lg">
                <div className="text-white text-center">
                  <div className="text-3xl sm:text-4xl font-bold opacity-20 mb-2">📄</div>
                  <div className="text-xs sm:text-sm opacity-75">No Image Available</div>
                </div>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge variant="outline" className="text-amber border-amber text-xs sm:text-sm">
                    Featured
                  </Badge>
                )}
              </div>
              <h1
                id="article-heading"
                className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-eerie-black mb-4 sm:mb-6 leading-tight"
              >
                {post.title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6">{post.excerpt}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-t border-b border-platinum gap-3 sm:gap-0">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {post.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Share article" className="text-xs sm:text-sm px-3 sm:px-4">
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white shadow-lg rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleInstagramShare}
                        aria-label="Share on Instagram"
                        className="p-2 hover:bg-violet-blue hover:text-white rounded-full"
                      >
                        <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleWhatsAppShare}
                        aria-label="Share on WhatsApp"
                        className="p-2 hover:bg-violet-blue hover:text-white rounded-full"
                      >
                        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleTwitterShare}
                        aria-label="Share on Twitter"
                        className="p-2 hover:bg-violet-blue hover:text-white rounded-full"
                      >
                        <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </PopoverContent>
                  </Popover>
                  <Button variant="download" size="sm" asChild className="text-xs sm:text-sm px-3 sm:px-4">
                    <a href={`/api/blog/${post.slug}/pdf`} download>
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      PDF
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <LazyLoad height={200} offset={100}>
              <div className="prose max-w-none space-y-4 sm:space-y-6">
                {parsedContent}
              </div>
            </LazyLoad>
          </Container>
        </article>

        <section className="py-8 sm:py-12 bg-platinum/20">
          <Container>
            <Card className="shadow-card">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-h3 text-egyptian-blue mb-3 sm:mb-4">
                  Need Technical Support?
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                  Our technical experts are available to help you implement these solutions in your
                  specific project requirements.
                </p>
                <div className="flex flex-col gap-3 sm:gap-4 justify-start sm:justify-center">
                  <Button variant="cta" size="lg" asChild className="w-auto min-w-[160px] px-3 sm:min-w-[200px] sm:px-4 py-2">
                    <Link to={`/downloads/${post.slug}-datasheet.pdf`}>Download Technical Data Sheet</Link>
                  </Button>
                  <Button variant="enterprise" size="lg" asChild className="w-auto min-w-[160px] px-3 sm:min-w-[200px] sm:px-4 py-2">
                    <Link to="/contact">Speak with Expert</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Container>
        </section>

        {relatedPosts?.length > 0 && (
          <LazyLoad height={200} offset={100}>
            <section className="py-8 sm:py-12 bg-white">
              <Container>
                <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-h3 text-egyptian-blue mb-6 sm:mb-8 text-center">
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost._id} className="shadow-card hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-4 sm:p-6">
                        <Badge variant="outline" className="mb-2 sm:mb-3 text-xs sm:text-sm">
                          {relatedPost.category}
                        </Badge>
                        <h4 className="font-semibold text-base sm:text-lg text-eerie-black mb-3 sm:mb-4 leading-tight">
                          {relatedPost.title}
                        </h4>
                        <Button asChild variant="ghost" size="sm" className="p-0 h-auto text-xs sm:text-sm">
                          <Link
                            to={`/blog/${relatedPost.slug}`}
                            className="text-egyptian-blue hover:text-violet-blue"
                          >
                            Read Article →
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Container>
            </section>
          </LazyLoad>
        )}
      </div>
      {/* Floating CTA */}
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 px-4">
        <Button variant="action" size="sm" className="shadow-xl" onClick={handleWhatsAppRedirect}>
          <MessageCircleCode className="h-4 w-4 mr-2" />
          Quick Quote
        </Button>
      </div>
    </>
  );
};

export default BlogPost;