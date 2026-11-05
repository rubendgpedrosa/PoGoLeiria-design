import config from '@pogoleiria/eslint-config'

const sharedConfig = [
  ...config,
  // These packages have no Next.js routes; test images are jsdom fixtures.
  { rules: { '@next/next/no-html-link-for-pages': 'off' } },
  { files: ['tests/**/*.{ts,tsx}'], rules: { '@next/next/no-img-element': 'off' } },
]

export default sharedConfig
