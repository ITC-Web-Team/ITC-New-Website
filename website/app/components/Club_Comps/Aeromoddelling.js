'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'Aeromodelling',
  description: 'Build, test, and refine flight-focused projects with a club experience centered on engineering and iteration.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/ahCadaPjlOYB-Deh/scene.splinecode',
};

export default function Aeromodelling(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
