import { useState } from 'react';
import { MessageSquare, ThumbsUp, Flag, Search, Plus, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface Post {
  id: string;
  title: string;
  body: string;
  author: string;
  authorFlag: string;
  category: string;
  upvotes: number;
  replies: number;
  date: string;
  tags: string[];
  outcome?: 'success' | 'pending' | 'rejection';
  upvoted?: boolean;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    title: 'Got my Spain Researcher Visa in 5 weeks — here\'s exactly what I did',
    body: 'After 3 failed attempts to understand the process, I finally cracked it. The key was getting a hosting agreement from UAB through cold email. Here\'s my full timeline...',
    author: 'Carlos M.',
    authorFlag: '🇻🇪',
    category: 'Success Story',
    upvotes: 47,
    replies: 12,
    date: '3 days ago',
    tags: ['Spain', 'Researcher Visa', 'UAB', 'Cold Email'],
    outcome: 'success',
  },
  {
    id: '2',
    title: 'Netherlands HSM: My salary is €4,800 — do I qualify (under 30)?',
    body: 'I\'ve been offered €4,800/month by an Amsterdam company. I\'m 27. The IND website says €3,909 for under 30 but the company says it needs to be higher. Confused.',
    author: 'Priya S.',
    authorFlag: '🇮🇳',
    category: 'Question',
    upvotes: 23,
    replies: 8,
    date: '1 week ago',
    tags: ['Netherlands', 'HSM', 'Salary Threshold'],
    outcome: 'pending',
  },
  {
    id: '3',
    title: 'Germany Job Seeker Visa rejected — my documentation was incomplete',
    body: 'I got rejected because my degree was not recognized and I didn\'t provide the anabin evaluation. Sharing my experience so others don\'t make the same mistake.',
    author: 'Ahmad K.',
    authorFlag: '🇸🇾',
    category: 'Rejection Story',
    upvotes: 31,
    replies: 19,
    date: '2 weeks ago',
    tags: ['Germany', 'Job Seeker', 'Rejection', 'Degree Recognition'],
    outcome: 'rejection',
  },
  {
    id: '4',
    title: 'KU Leuven hosting agreement — exactly how I got my supervisor to say yes',
    body: 'After 40+ cold emails, only 3 responded. Here\'s the exact email structure that worked, what NOT to say, and which departments are most open to international researchers.',
    author: 'Fatima O.',
    authorFlag: '🇳🇬',
    category: 'Guide',
    upvotes: 89,
    replies: 34,
    date: '1 month ago',
    tags: ['Belgium', 'KU Leuven', 'Cold Email', 'Hosting Agreement'],
    outcome: 'success',
  },
  {
    id: '5',
    title: 'Portugal D3 visa — AIMA appointment wait is now 14 months. What to do?',
    body: 'I entered Portugal on my D3 visa 4 months ago. Got my NIF and opened a bank account. But the earliest AIMA appointment available is 14 months away. Is this legal?',
    author: 'Bruno T.',
    authorFlag: '🇧🇷',
    category: 'Question',
    upvotes: 15,
    replies: 22,
    date: '5 days ago',
    tags: ['Portugal', 'D3 Visa', 'AIMA', 'Residence Permit'],
    outcome: 'pending',
  },
  {
    id: '6',
    title: 'Spain vs Italy for researchers — honest comparison after 2 years in Spain',
    body: 'I came to Spain on a researcher visa in 2024. My colleague chose Italy. After comparing notes, here are the real differences nobody tells you about.',
    author: 'Leila H.',
    authorFlag: '🇮🇷',
    category: 'Comparison',
    upvotes: 62,
    replies: 27,
    date: '3 weeks ago',
    tags: ['Spain', 'Italy', 'Researcher Visa', 'Comparison'],
    outcome: 'success',
  },
];

const CATEGORIES = ['All', 'Success Story', 'Question', 'Guide', 'Comparison', 'Rejection Story'];
const COUNTRY_TAGS = ['All', 'Spain', 'Germany', 'Netherlands', 'Italy', 'Belgium', 'Portugal'];

const outcomeConfig = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rejection: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [category, setCategory] = useState('All');
  const [countryTag, setCountryTag] = useState('All');
  const [search, setSearch] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'Question', tags: '' });
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filtered = posts.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (countryTag !== 'All' && !p.tags.includes(countryTag)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpvote = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1, upvoted: !p.upvoted } : p
    ));
  };

  const handleNewPost = () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      body: newPost.body,
      author: 'You',
      authorFlag: '🌍',
      category: newPost.category,
      upvotes: 0,
      replies: 0,
      date: 'Just now',
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', body: '', category: 'Question', tags: '' });
    setShowNewPost(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Community</h1>
            <p className="text-slate-400 max-w-xl">
              Real experiences from people navigating EU immigration. Ask questions, share stories, and help others.
            </p>
          </div>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="btn-primary flex items-center gap-2 text-sm py-2.5 flex-shrink-0"
          >
            <Plus size={15} /> New Post
          </button>
        </div>

        {/* New post form */}
        {showNewPost && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Share Your Experience</h3>
              <button onClick={() => setShowNewPost(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <input className="input" placeholder="Title — be specific about your situation" value={newPost.title} onChange={e => setNewPost(n => ({ ...n, title: e.target.value }))} />
              <textarea className="input resize-none h-28" placeholder="Share your full story, question, or guide..." value={newPost.body} onChange={e => setNewPost(n => ({ ...n, body: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select className="select" value={newPost.category} onChange={e => setNewPost(n => ({ ...n, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Tags (comma-separated)</label>
                  <input className="input" placeholder="e.g. Spain, Researcher Visa" value={newPost.tags} onChange={e => setNewPost(n => ({ ...n, tags: e.target.value }))} />
                </div>
              </div>
              <button onClick={handleNewPost} className="btn-primary w-full">Post to Community</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs border transition-colors', category === c ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600')}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {COUNTRY_TAGS.map(c => (
            <button
              key={c}
              onClick={() => setCountryTag(c)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs border transition-colors', countryTag === c ? 'bg-violet-600 border-violet-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600')}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="text-slate-500 text-sm mb-5">{filtered.length} post{filtered.length !== 1 && 's'}</p>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map(post => {
            const isExpanded = expandedPost === post.id;
            return (
              <div key={post.id} className="card hover:border-slate-600 transition-all">
                <div className="flex items-start gap-3">
                  {/* Upvote */}
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={clsx(
                      'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all flex-shrink-0',
                      post.upvoted ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    )}
                  >
                    <ThumbsUp size={13} />
                    <span className="text-xs font-semibold">{post.upvotes}</span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <span className="badge bg-slate-700/50 text-slate-300 text-xs">{post.category}</span>
                      {post.outcome && (
                        <span className={clsx('badge border text-xs', outcomeConfig[post.outcome])}>
                          {post.outcome.charAt(0).toUpperCase() + post.outcome.slice(1)}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-white font-semibold mb-1 cursor-pointer hover:text-blue-300 transition-colors"
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                    >
                      {post.title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                      {isExpanded ? post.body : post.body.slice(0, 150) + (post.body.length > 150 ? '...' : '')}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map(tag => (
                        <button key={tag} onClick={() => { if (COUNTRY_TAGS.includes(tag)) setCountryTag(tag); }} className="badge bg-slate-800 text-slate-400 text-xs hover:text-slate-200 transition-colors">
                          #{tag}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 text-xs">
                      <span>{post.authorFlag} {post.author}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} /> {post.replies} replies</span>
                      <span>{post.date}</span>
                      <button
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-auto transition-colors"
                      >
                        {isExpanded ? 'Collapse' : 'Read more'}
                        <ChevronDown size={12} className={clsx('transition-transform', isExpanded && 'rotate-180')} />
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-xs">💬 {post.replies} community replies — login required to reply</p>
                      <button className="flex items-center gap-1 text-slate-500 hover:text-slate-400 text-xs transition-colors">
                        <Flag size={11} /> Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
