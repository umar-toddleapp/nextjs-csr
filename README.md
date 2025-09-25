# Next.js CSR App with App Router

A comprehensive client-side rendered Next.js application featuring App Router, Redux state management, GraphQL/REST API integration, and 4-level nested routing.

## 🚀 Features

- **Client-Side Rendering Only**: Configured for CSR with Next.js App Router
- **Dynamic API Switching**: Switches between REST and GraphQL APIs based on mode
- **4-Level Nested Routing**: Deep navigation examples for both API types
- **Redux State Management**: Global state with Redux Toolkit
- **Apollo GraphQL Client**: With caching enabled
- **CSS Modules**: Beautiful, custom styling without external UI libraries
- **Iframe Embedding**: Configured for secure iframe usage
- **PostMessage Communication**: Listens for mode changes from parent window
- **Draft Mode**: Disables interactions while preserving scrolling

## 📋 API Routes

### REST API Routes (JSONPlaceholder)

```
/rest                                    # REST API home
/rest/users/[userId]                     # User details
/rest/users/[userId]/posts/[postId]      # Post details
/rest/users/[userId]/posts/[postId]/comments/[commentId]  # Comment details (4 levels)
```

### GraphQL API Routes (Countries API)

```
/graphql                                 # GraphQL API home
/graphql/countries/[code]                # Country details
/graphql/countries/[code]/languages/[lang]  # Language details
/graphql/countries/[code]/languages/[lang]/details/[detailId]  # Language detail info (4 levels)
```

## 🛠️ Tech Stack

- **Next.js 15** - App Router
- **React 19** - UI Components
- **Redux Toolkit** - State Management
- **Apollo Client** - GraphQL Client
- **CSS Modules** - Styling
- **JavaScript** - No TypeScript

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   ├── loading.js               # Loading component
│   ├── page.js                  # Home page
│   ├── rest/                    # REST API routes
│   │   ├── page.js
│   │   └── users/[userId]/
│   │       ├── page.js
│   │       └── posts/[postId]/
│   │           ├── page.js
│   │           └── comments/[commentId]/
│   │               └── page.js  # 4th level
│   └── graphql/                 # GraphQL API routes
│       ├── page.js
│       └── countries/[code]/
│           ├── page.js
│           └── languages/[lang]/
│               ├── page.js
│               └── details/[detailId]/
│                   └── page.js  # 4th level
├── components/                   # React components
│   ├── ApolloProvider.js
│   ├── Breadcrumb.js
│   ├── ClientLayout.js
│   ├── PostMessageProvider.js
│   └── ReduxProvider.js
├── redux/                        # Redux store and slices
│   ├── store.js
│   └── slices/
│       ├── dataSlice.js
│       └── modeSlice.js
├── styles/                       # CSS Modules
│   ├── Breadcrumb.module.css
│   ├── ClientLayout.module.css
│   ├── HomePage.module.css
│   ├── RestPage.module.css
│   ├── GraphQLPage.module.css
│   ├── UserDetailPage.module.css
│   ├── PostDetailPage.module.css
│   ├── CommentDetailPage.module.css
│   ├── CountryDetailPage.module.css
│   ├── LanguageDetailPage.module.css
│   ├── DetailPage.module.css
│   └── Loading.module.css
├── lib/                          # Utilities
│   └── apollo.js                # Apollo Client setup
├── next.config.js               # Next.js configuration
├── vercel.json                  # Vercel deployment config
└── plan.md                      # Development plan with checkmarks
```

## 🎯 Mode-Based API Switching

The app listens for `postMessage` events from the parent window to determine which API to use:

- **Default Mode** (no mode set): Uses REST API (JSONPlaceholder)
- **Preview Mode**: Uses GraphQL API (Countries)
- **Draft Mode**: Uses GraphQL API + disables UI interactions (keeps scrolling)

### PostMessage Format

```javascript
// From parent window
window.postMessage({ mode: "preview" }, "*");
window.postMessage({ mode: "draft" }, "*");
window.postMessage({ mode: null }, "*"); // or any other value for REST
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🖼️ Iframe Embedding

The app is configured to work within iframes:

### HTML Example

```html
<iframe src="http://localhost:3000" width="100%" height="600" frameborder="0">
</iframe>

<script>
  // Send mode to iframe
  const iframe = document.querySelector("iframe");
  iframe.onload = () => {
    iframe.contentWindow.postMessage({ mode: "preview" }, "*");
  };
</script>
```

### Security Headers

- `X-Frame-Options: ALLOWALL`
- `Content-Security-Policy: frame-ancestors *;`

## 🎨 UI Features

### Breadcrumb Navigation

- Dynamic breadcrumbs that update with the current route
- Shows all 4 levels of nested navigation
- Clickable navigation to parent levels

### Draft Mode

- Disables all UI interactions (buttons, links, inputs)
- Preserves scrolling functionality
- Visual indication with opacity changes

### Loading States

- Custom loading components with spinners
- Loading states for all API calls
- Error handling with retry options

### Responsive Design

- CSS Grid layouts
- Beautiful card-based UI
- Smooth transitions and hover effects

## 🌐 API Integration

### REST API (JSONPlaceholder)

```javascript
// Example API calls
GET https://jsonplaceholder.typicode.com/users
GET https://jsonplaceholder.typicode.com/posts
GET https://jsonplaceholder.typicode.com/comments
```

### GraphQL API (Countries)

```graphql
# Example queries
query GetCountries {
  countries {
    code
    name
    emoji
    languages {
      code
      name
    }
  }
}

query GetCountry($code: ID!) {
  country(code: $code) {
    name
    capital
    languages {
      code
      name
    }
  }
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**:

   ```bash
   npx vercel
   ```

2. **Deploy**:
   ```bash
   npx vercel --prod
   ```

The `vercel.json` file ensures proper iframe embedding headers are set.

### Environment Variables

No environment variables required - all APIs are public.

## 🧪 Testing the App

### Testing Mode Switching

1. Open browser developer console
2. Run: `window.postMessage({ mode: 'preview' }, '*')`
3. Navigate to see GraphQL data
4. Run: `window.postMessage({ mode: 'draft' }, '*')`
5. Try clicking buttons (should be disabled)

### Testing Nested Routing

1. **REST**: Navigate to `/rest` → click a user → click a post → click a comment
2. **GraphQL**: Navigate to `/graphql` → click a country → click a language → click a detail

## 📝 Development Notes

- All components use CSS Modules for styling
- Redux store persists mode and API data
- Apollo Client cache is enabled for GraphQL queries
- Breadcrumbs automatically update based on current route
- Error boundaries handle API failures gracefully

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
