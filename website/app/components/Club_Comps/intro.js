'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'Intro',
  description: 'A full-screen opening scene for the clubs page, using the same spline-led entrance language as the home page.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/2vNrWv1hlkDFdsiW/scene.splinecode',
};

export default function Intro(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
