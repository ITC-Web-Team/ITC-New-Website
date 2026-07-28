'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'BioX',
  description: 'An interdisciplinary club exploring biology, biotechnology, and computation through hands-on projects.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/BPQWXGJSsM-eExXQ/scene.splinecode',
};

export default function Biox(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
