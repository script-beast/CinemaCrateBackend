import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "";

export const CinemaCrateOTP = ({ name, otp }) => {
  return (
    <Html>
      <Head>
        {/* Email Title */}
        <title>Welcome to CinemaCrate! Verify Your Account</title>
      </Head>
      {/* Preview is displayed in the inbox table of the recipient */}
      <Preview>Complete your registration and unlock all the features.</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#ffe049',
                primary2: '#ffca22',
                dark: '#393E46',
                dark2: '#222831',
                white: '#fafafa',
                lightgrey: '#ebebeb',
                grey: '#c4c4c4',
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="bg-dark2 text-white rounded-xl my-8 mx-auto p-6 max-w-[420px]">
            <Section className="my-4">
              <Img
                src="https://vitejs.dev/logo-with-shadow.png"
                alt="CinemaCrate Logo"
                className="h-16 mx-auto"
              />
              <Text className="text-primary text-center tracking-[0.25rem]">
                CINEMA CRATE
              </Text>
            </Section>
            <Hr className="border-grey" />
            <Section className="my-4">
              <Text>Hello {name},</Text>
              <Text>Thanks for joining the CinemaCrate community!</Text>
              <Text>
                To complete your registration and access everything we offer,
                verify your email address with this code:
              </Text>
              <Text className="text-center text-2xl tracking-[0.25rem] font-semibold mt-8 bg-dark rounded p-4">
                {otp}
              </Text>
              {/* Headings are not rendered inside Tailwind (bug only fixed in canary version, as of writing) */}
            </Section>
            <Section className="my-4">
              <Text className="my-0">See you on the inside,</Text>
              <Text className="my-0">The CinemaCrate Team</Text>
              <Text>
                Did you receive this email by mistake?{' '}
                <Link
                  href="mailto:support@cinemacrate.com"
                  className="text-white font-medium"
                >
                  Please let us know.
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

CinemaCrateOTP.PreviewProps = {
  name: 'Ashutosh Singh',
  otp: 909090,
};

export default CinemaCrateOTP;
