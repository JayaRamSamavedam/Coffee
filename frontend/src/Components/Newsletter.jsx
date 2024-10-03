import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate a subscription request (you can replace this with an actual API call)
    console.log('Subscribed email:', email);
    setEmail('');  // Reset the email field on successful subscription
  };

  return (
    <div className="py-15 md:py-15 lg:py-30 dark:bg-[#2a1a14]">
      <div className="container mx-auto px-5 rounded-lg xl:max-w-screen-xl">
        <div className="border-2 p-3 border-[#8b6f4e] dark:border-[#d3b89b] px-5 rounded-lg bg-[#f5f3f0] dark:bg-[#2a1a14] lg:flex lg:justify-center lg:items-center lg:p-10 shadow-lg dark:shadow-none">
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-center text-[#4b3f34] dark:text-[#d3b89b] md:text-4xl lg:text-left">
              Sign up for our Newsletter
            </h1>
            <p className="mt-2 text-[#7a5e48] dark:text-[#e5c1a8] text-center lg:text-left">
              Get the latest updates and offers right in your inbox.
            </p>
            <form className="mt-5 sm:mx-auto sm:flex sm:max-w-lg lg:mx-0" onSubmit={handleSubmit}>
              <input
                className="block w-full px-5 py-3 outline-none border border-[#8b6f4e] dark:border-[#3c2a1b] rounded-lg shadow-sm bg-[#ebe2d6] dark:bg-[#3c2a1b] text-[#4b3f34] dark:text-[#d3b89b] dark:focus:border-[#900C3F] dark:focus:ring-2 dark:focus:ring-[#900C3F] focus:border-[#998200] focus:ring-2 focus:ring-[#998200] transition duration-300"
                type="email"
                placeholder="Your e-mail"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button
                type="submit"
                className="w-full mt-2.5 px-5 py-3 rounded-lg shadow-md bg-[#4b3f34] text-[#f5f3f0] font-medium hover:bg-[#7a5e48] transition duration-300 sm:flex-shrink-0 sm:w-auto sm:mt-0 sm:ml-5 dark:bg-[#d3b89b] dark:text-[#2a1a14] dark:hover:bg-[#8b6f4e]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
