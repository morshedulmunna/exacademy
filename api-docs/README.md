# Execute Academy API Documentation

A modern, responsive API documentation site built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern Design**: Clean, professional interface with dark/light mode support
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🔍 **Search**: Quick search through API endpoints
- 📋 **Copy to Clipboard**: One-click copying of endpoints and code examples
- 🎯 **Syntax Highlighting**: Beautiful code highlighting with Prism.js
- 🏷️ **Categorized**: Organized API endpoints by categories
- ⚡ **Fast**: Built with Next.js 14 for optimal performance
- 🎭 **Interactive**: Collapsible sections and expandable examples

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **Syntax Highlighting**: React Syntax Highlighter
- **Theme**: Next Themes for dark/light mode
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd api-docs
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

## Project Structure

```
api-docs/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── ...             # Feature-specific components
│   ├── data/               # API documentation data
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── ...                     # Configuration files
```

## Customization

### Adding New API Endpoints

1. Edit `src/data/api-docs.ts` to add your API endpoints
2. Follow the existing structure for consistency
3. Include all required fields: method, path, title, description, etc.

### Styling

- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Use the existing component library for consistency

### Components

The project includes several reusable components:

- `Header`: Navigation and search
- `Sidebar`: API categories and navigation
- `ApiEndpoint`: Individual endpoint documentation
- `CodeBlock`: Syntax highlighted code examples
- `Button`, `Card`, `Badge`: UI components

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
