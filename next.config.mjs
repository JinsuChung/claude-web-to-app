import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: { unoptimized: true },
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
};

export default withMDX(config);
