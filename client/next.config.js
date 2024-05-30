const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const port = process.env.NEXT_PUBLIC_BACKEND_PORT;

module.exports = {
    images: {
      unoptimized: true,
      domains: [
        backendURL,
        'localhost',
      ],
    },
  };