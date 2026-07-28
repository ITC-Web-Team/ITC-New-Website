'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'ChemETL',
  description: 'An applied chemistry and process-technology club for projects spanning experimentation and scale-up thinking.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/OxLHXGyVJ5nd07Wn/scene.splinecode',
};

export default function Chemetl(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
