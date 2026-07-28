'use client';

import ClubSection from './ClubSection';

const defaultProps = {
  clubName: 'ERC',
  description: 'A robotics and electronics club where prototyping, circuits, and embedded systems come together.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/emaIyFBXhsBa3YGI/scene.splinecode',
};

export default function Erc(props) {
  return <ClubSection {...defaultProps} {...props} />;
}
