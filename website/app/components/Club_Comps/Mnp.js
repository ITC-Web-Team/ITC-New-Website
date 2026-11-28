'use client';

import ClubSection from './ClubSection';

const defaultProps = {
    clubName: 'MNP',
    description: 'A makerspace for materials, nano-projects, and practical experimentation built for curious engineers.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://my.spline.design/gradientblob-y4hkQRL4y8QnHXyrEKnBbh2Z/',
};

export default function Mnp(props) {
    return <ClubSection {...defaultProps} {...props} />;
}
