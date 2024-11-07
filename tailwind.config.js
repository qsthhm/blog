/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: {
          light: '#ffffff',
          dark: '#171717',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4', 
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      maxWidth: {
        'content': '680px',  // 内容区域最大宽度
      },
      width: {
        'logo': '64px',      // Logo宽度
      },
      height: {
        'logo': '44px',      // Logo高度
        'nav': '60px',       // 导航栏高度
      },
      margin: {
        'nav': '60px',       // 导航栏高度的 margin
      },
      spacing: {
        'article-gap': '32px',  // 文章卡片之间的间距
        'row-gap': '40px',      // 行间距
      },
      aspectRatio: {
        'thumbnail': '16 / 9',  // 缩略图比例
        'square': '1 / 1',      // 正方形比例
      },
      fontSize: {
        'page-title': ['2rem', '1.3'],      // 页面标题大小和行高
        'article-title': ['1.125rem', '1.5'] // 文章标题大小和行高
      },
      padding: {
        'card-hover': '16px',  // 卡片hover时的内边距
      },
      lineHeight: {
        'paragraph': '1.75',  // 添加自定义行高
      },
      lineClamp: {
        1: '1',
        2: '2',
        3: '3',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: '1.125rem', // 增大基础字号
            lineHeight: '1.75',    // 调整行高
            p: {
              marginBottom: '1.5em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              fontWeight: '400',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            },
            maxWidth: 'none',
            color: theme('colors.neutral.900'),
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.neutral.900'),
              'scroll-margin-top': '60px',
            },
            strong: {
              color: theme('colors.neutral.900'),
              fontWeight: '600',
            },
            code: {
              color: theme('colors.neutral.900'),
              fontWeight: '400',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.neutral.200'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.neutral.100'),
            },
            strong: {
              color: theme('colors.neutral.100'),
            },
            code: {
              color: theme('colors.neutral.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
}