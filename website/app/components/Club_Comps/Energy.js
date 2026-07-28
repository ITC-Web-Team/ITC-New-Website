'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'Energy',
  description: 'A club dedicated to energy systems, sustainability, and practical engineering around power and efficiency.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/1kxdvBqKD-xqx4GS/scene.splinecode',
};

export default function Energy(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
