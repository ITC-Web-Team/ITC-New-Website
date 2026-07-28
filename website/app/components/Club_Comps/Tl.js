'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'TL',
  description: 'A flexible technical learning space for members building interdisciplinary projects and leadership skills.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
};

export default function Tl(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
