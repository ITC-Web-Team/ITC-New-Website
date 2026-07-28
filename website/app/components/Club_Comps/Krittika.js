'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'Krittika',
  description: 'A space for astronomy, astrophotography, and observational projects that turn curiosity into hands-on exploration.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/vhWTM0J5b9R4G5Dn/scene.splinecode',
};

export default function Krittika(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
