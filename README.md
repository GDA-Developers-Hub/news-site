# NEWS Portal

A modern news portal built with Next.js, TypeScript, and Tailwind CSS, inspired by CNN's design. This application fetches real-time news from NewsAPI and provides a beautiful, responsive interface for browsing the latest headlines with a commitment to accuracy and quality journalism.

## Features

- 📰 **Real-time News**: Fetches latest news from NewsAPI
- 🎨 **Modern UI**: Clean, responsive design inspired by CNN
- 🔍 **Search Functionality**: Search for specific news topics
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🏷️ **Category Filtering**: Browse news by categories
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized for speed
- 🌍 **Global Coverage**: World and US news with comprehensive coverage

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **News API**: NewsAPI.org

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd news
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Configuration

The app is already configured with the NewsAPI key: `8d500dfc964a4a52a337be5fc21f00dd`

If you need to use your own API key:

1. Get a free API key from [NewsAPI.org](https://newsapi.org/)
2. Update the `NEWSAPI_KEY` constant in `lib/newsApi.ts`

## Project Structure

```
news/
├── app/                    # Next.js App Router
│   ├── category/          # Category pages
│   ├── search/            # Search functionality
│   ├── test-simple/       # Simple API test page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   └── NewsCard.tsx       # News article card
├── lib/                   # Utility functions
│   └── newsApi.ts         # NewsAPI service
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Homepage

- Featured news section with prominent display
- Latest news grid layout
- Business news sidebar
- Responsive design for all screen sizes
- Commitment to accuracy and quality journalism

### Search

- Search across all news articles
- Real-time search results
- Clean search interface

### Categories

- **World**: Global news from multiple countries
- **Politics**: Political news and updates
- **Business**: Business and financial news
- **Technology**: Tech industry updates
- **Health**: Health and medical news
- **Entertainment**: Entertainment and culture
- **Sports**: Sports news and updates
- **Science**: Scientific discoveries and research

### News Cards

- Article images with fallback
- Source attribution
- Publication date
- Author information
- Category badges
- External links to full articles

## Styling

The app uses Tailwind CSS with custom CNN-inspired colors:

- Primary Red: `#CC0000` (cnn-red)
- Dark Background: `#1a1a1a` (cnn-dark)
- Light Gray: `#f8f9fa` (cnn-gray)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## API Usage

The app uses NewsAPI's free tier which includes:

- 1,000 requests per day
- Top headlines endpoint
- Everything endpoint
- Sources endpoint
- Multi-country news aggregation

## Recent Updates

- **Removed Kenya/Africa specific news sections** for broader global focus
- **Removed US news category** to streamline navigation
- **Eliminated NewsData.io integration** to simplify the codebase
- **Updated branding** from "WebApp" to "Portal" for a more professional appearance
- **Enhanced messaging** emphasizing commitment to accuracy and quality journalism
- **Streamlined navigation** with World tab linking to homepage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing the news data
- [CNN](https://edition.cnn.com) for design inspiration
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
