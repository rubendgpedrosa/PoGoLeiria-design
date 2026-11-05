/** @type {import('next').NextConfig} */
const nextConfig = {
  // The vendored @pogoleiria/ui is imported through the tsconfig path alias
  // (@pogoleiria/ui -> vendor/pogoleiria/packages/ui/src/index.ts), so it is
  // ordinary project source: no npm dependency, no symlink, no transpile list.
  typedRoutes: false,
}

export default nextConfig
