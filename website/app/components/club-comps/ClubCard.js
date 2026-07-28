'use client';

import ClubSection from '../Club_Comps/ClubSection';

const placeholderCardProps = {
  clubName: 'Club Name',
  description: 'Replace this placeholder with club-specific copy, links, and spline metadata.',
  websiteUrl: 'https://tech-iitb.org/clubs/',
  instagramHandle: 'tech.iitb',
  linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
  splineScene: 'https://prod.spline.design/7BKUCAYUubE4SAct/scene.splinecode',
};

export default function ClubCard(props) {
  return <ClubSection {...placeholderCardProps} {...props} />;
}