'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'WNCC',
  description: 'A community for coding, collaboration, and technical growth with a strong project-oriented rhythm.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/BI-mcBhItOMri26t/scene.splinecode',
};

export default function WnCC(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
