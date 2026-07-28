'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'CSEC',
  description: 'A systems and cybersecurity club built around secure thinking, careful debugging, and technical depth.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/PUgW0zr7D6hSOTbL/scene.splinecode',
};

export default function Csec(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
