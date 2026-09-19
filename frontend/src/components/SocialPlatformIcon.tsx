import React, { useState } from 'react';
import {
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Globe,
  Send,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

export interface DetectedPlatformResult {
  platform: string;
  icon: string;
  iconSource: 'platform' | 'favicon' | 'custom';
  displayName: string;
}

/**
 * Safely extract domain / hostname from any URL string.
 */
export function extractHostname(rawUrl: string): string {
  if (!rawUrl) return '';
  try {
    let clean = rawUrl.trim();
    if (/^mailto:/i.test(clean)) return 'email';
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Intelligently detect social/contact platform and icon from URL and Name.
 */
export function detectPlatform(rawUrl: string, rawName = ''): DetectedPlatformResult {
  const url = (rawUrl || '').trim().toLowerCase();
  const name = (rawName || '').trim().toLowerCase();

  // 1. Email / Mailto
  if (
    url.startsWith('mailto:') ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url) ||
    name === 'email' ||
    name === 'gmail' ||
    name === 'mail' ||
    name.includes('contact email')
  ) {
    return {
      platform: 'email',
      icon: 'mail',
      iconSource: 'platform',
      displayName: 'Email',
    };
  }

  // 2. WhatsApp
  if (
    url.includes('wa.me') ||
    url.includes('whatsapp.com') ||
    name.includes('whatsapp') ||
    name === 'wa'
  ) {
    return {
      platform: 'whatsapp',
      icon: 'whatsapp',
      iconSource: 'platform',
      displayName: 'WhatsApp',
    };
  }

  // 3. LinkedIn
  if (url.includes('linkedin.com') || name.includes('linkedin')) {
    return {
      platform: 'linkedin',
      icon: 'linkedin',
      iconSource: 'platform',
      displayName: 'LinkedIn',
    };
  }

  // 4. GitHub
  if (url.includes('github.com') || name.includes('github')) {
    return {
      platform: 'github',
      icon: 'github',
      iconSource: 'platform',
      displayName: 'GitHub',
    };
  }

  // 5. Twitter / X
  if (
    url.includes('twitter.com') ||
    url.includes('x.com') ||
    name.includes('twitter') ||
    name === 'x' ||
    name.includes('twitter / x')
  ) {
    return {
      platform: 'x',
      icon: 'x',
      iconSource: 'platform',
      displayName: 'Twitter / X',
    };
  }

  // 6. Instagram
  if (url.includes('instagram.com') || name.includes('instagram')) {
    return {
      platform: 'instagram',
      icon: 'instagram',
      iconSource: 'platform',
      displayName: 'Instagram',
    };
  }

  // 7. YouTube
  if (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    name.includes('youtube')
  ) {
    return {
      platform: 'youtube',
      icon: 'youtube',
      iconSource: 'platform',
      displayName: 'YouTube',
    };
  }

  // 8. Facebook
  if (
    url.includes('facebook.com') ||
    url.includes('fb.com') ||
    name.includes('facebook')
  ) {
    return {
      platform: 'facebook',
      icon: 'facebook',
      iconSource: 'platform',
      displayName: 'Facebook',
    };
  }

  // 9. Telegram
  if (
    url.includes('t.me') ||
    url.includes('telegram.me') ||
    url.includes('telegram.org') ||
    name.includes('telegram')
  ) {
    return {
      platform: 'telegram',
      icon: 'telegram',
      iconSource: 'platform',
      displayName: 'Telegram',
    };
  }

  // 10. Discord
  if (url.includes('discord.gg') || url.includes('discord.com') || name.includes('discord')) {
    return {
      platform: 'discord',
      icon: 'discord',
      iconSource: 'platform',
      displayName: 'Discord',
    };
  }

  // 11. Notion
  if (url.includes('notion.so') || url.includes('notion.site') || name.includes('notion')) {
    return {
      platform: 'notion',
      icon: 'notion',
      iconSource: 'platform',
      displayName: 'Notion',
    };
  }

  // 12. Slack
  if (url.includes('slack.com') || name.includes('slack')) {
    return {
      platform: 'slack',
      icon: 'slack',
      iconSource: 'platform',
      displayName: 'Slack',
    };
  }

  // 13. Reddit
  if (url.includes('reddit.com') || name.includes('reddit')) {
    return {
      platform: 'reddit',
      icon: 'reddit',
      iconSource: 'platform',
      displayName: 'Reddit',
    };
  }

  // 14. Medium
  if (url.includes('medium.com') || name.includes('medium')) {
    return {
      platform: 'medium',
      icon: 'medium',
      iconSource: 'platform',
      displayName: 'Medium',
    };
  }

  // 15. Substack
  if (url.includes('substack.com') || name.includes('substack')) {
    return {
      platform: 'substack',
      icon: 'substack',
      iconSource: 'platform',
      displayName: 'Substack',
    };
  }

  // 16. Custom Website / Hostname detection
  const domain = extractHostname(url);
  if (domain && domain !== 'email') {
    return {
      platform: 'website',
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      iconSource: 'favicon',
      displayName: domain,
    };
  }

  return {
    platform: 'custom',
    icon: 'globe',
    iconSource: 'platform',
    displayName: 'Website / Link',
  };
}

/**
 * High-definition SVG vectors for platforms not standard in Lucide or requiring brand-accurate marks.
 */
export const PlatformVectors: Record<string, React.FC<{ className?: string }>> = {
  // WhatsApp official mark
  whatsapp: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),

  // X (formerly Twitter) official vector mark
  x: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),

  // Telegram official paper plane mark
  telegram: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),

  // Discord mark
  discord: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),

  // Notion mark
  notion: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.69c-.466-.373-.933-.56-1.727-.513L2.36 2.296c-.373.047-.466.28-.326.467l2.425 1.445zm.747 3.313v13.535c0 .7.373.933 1.166.886l14.148-.84c.793-.046.98-.56.98-1.166V6.353c0-.606-.233-.886-.793-.84l-14.708.886c-.56.046-.793.42-.793.122zm12.367 1.214c.093.42 0 .84-.42.887l-.7.093v8.588c-.653.373-1.306.56-1.867.56-.933 0-1.213-.373-1.913-1.26l-4.153-6.208v6.208l1.353.28c.373.093.466.42.373.84-.093.42-.466.373-.84.373l-2.893.187c-.373 0-.56-.28-.467-.7.093-.42.373-.373.747-.42l.747-.093V9.827c0-.42-.233-.513-.7-.467l-.7.047c-.373.047-.56-.28-.467-.7.093-.42.42-.373.84-.373l3.08-.187c.84 0 1.54.467 2.053 1.214l3.967 5.928V9.64l-1.12-.233c-.373-.093-.466-.42-.373-.84.093-.42.466-.373.84-.373l2.8-.187c.373 0 .56.28.467.7z" />
    </svg>
  ),

  // Slack mark
  slack: ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
};

export interface SocialPlatformIconProps {
  platform?: string;
  icon?: string;
  iconSource?: 'platform' | 'favicon' | 'custom';
  url?: string;
  className?: string;
  alt?: string;
}

export const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({
  platform,
  icon,
  iconSource,
  url = '',
  className = 'w-4 h-4',
  alt = 'Platform icon',
}) => {
  const [imageError, setImageError] = useState(false);

  // Auto-detect if platform or iconSource is omitted
  const detected = (!platform || !iconSource) ? detectPlatform(url) : null;
  const activePlatform = (platform || detected?.platform || 'custom').toLowerCase();
  const activeSource = iconSource || detected?.iconSource || 'platform';
  const activeIcon = icon || detected?.icon || '';

  // 1. External Favicon or Custom Image URL
  const isImageUrl =
    (activeSource === 'favicon' || activeSource === 'custom' || activeIcon.startsWith('http')) &&
    !imageError;

  if (isImageUrl && activeIcon) {
    return (
      <img
        src={activeIcon}
        alt={alt}
        className={`${className} object-contain rounded-xs`}
        loading="lazy"
        onError={() => setImageError(true)}
      />
    );
  }

  // 2. Custom Dedicated Platform SVG Vectors
  if (PlatformVectors[activePlatform]) {
    const VectorComponent = PlatformVectors[activePlatform];
    return <VectorComponent className={className} />;
  }

  // 3. Lucide Icons for Known Platforms
  switch (activePlatform) {
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'github':
      return <Github className={className} />;
    case 'x':
    case 'twitter':
      return PlatformVectors.x ? <PlatformVectors.x className={className} /> : <Twitter className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'email':
    case 'mail':
      return <Mail className={className} />;
    case 'telegram':
      return <Send className={className} />;
    case 'whatsapp':
      return PlatformVectors.whatsapp ? <PlatformVectors.whatsapp className={className} /> : <MessageSquare className={className} />;
    case 'custom':
    case 'website':
    default:
      return <Globe className={className} />;
  }
};
export default SocialPlatformIcon;
