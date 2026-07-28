'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'Quant',
  description: 'A quantitative club for modeling, data-driven thinking, and the kind of problem solving that rewards precision.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/famZuWYiG2zvy9UF/scene.splinecode',
};

export default function Quant(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
