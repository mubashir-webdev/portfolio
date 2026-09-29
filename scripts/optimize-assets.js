const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processAll() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const publicDir = path.join(__dirname, '..', 'public');
  const portraitPath = path.join(imagesDir, 'portrait.png');

  console.log('--- Optimizing Project Images ---');
  const projectImages = [
    'project-college.jpg',
    'project-ecommerce.jpg',
    'project-chat.jpg',
    'project-dashboard.jpg',
    'project-auth.jpg'
  ];

  for (const imgName of projectImages) {
    const srcPath = path.join(imagesDir, imgName);
    if (!fs.existsSync(srcPath)) continue;
    const baseName = imgName.replace(/\.jpg$/, '');
    const webpPath = path.join(imagesDir, baseName + '.webp');

    await sharp(srcPath)
      .resize(800, null, { withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(webpPath);

    const origStat = fs.statSync(srcPath);
    const webpStat = fs.statSync(webpPath);
    console.log(`${imgName}: ${Math.round(origStat.size / 1024)}KB -> ${Math.round(webpStat.size / 1024)}KB (WebP)`);
  }

  console.log('--- Optimizing Portrait ---');
  // 1. Optimized square crop of face and shoulders (600x600)
  // In portrait.png (941 x 1672):
  // Let's center on Muhammad: width 860, height 860, left 40, top 20
  const squareCropPath = path.join(imagesDir, 'portrait-square.webp');
  await sharp(portraitPath)
    .extract({ left: 40, top: 20, width: 860, height: 860 })
    .resize(600, 600)
    .webp({ quality: 85, effort: 5 })
    .toFile(squareCropPath);

  // 2. Avatar for preloader (180x180 WebP)
  const avatarPath = path.join(imagesDir, 'portrait-avatar.webp');
  await sharp(squareCropPath)
    .resize(180, 180)
    .webp({ quality: 85 })
    .toFile(avatarPath);

  // Also fallback png for avatar
  const avatarPngPath = path.join(imagesDir, 'portrait-avatar.png');
  await sharp(squareCropPath)
    .resize(180, 180)
    .png({ quality: 90 })
    .toFile(avatarPngPath);

  // 3. Hero portrait webp (600x600 square crop is ideal for the circular hero frame!)
  const heroWebpPath = path.join(imagesDir, 'portrait.webp');
  await sharp(portraitPath)
    .extract({ left: 40, top: 20, width: 860, height: 860 })
    .resize(640, 640)
    .webp({ quality: 85, effort: 5 })
    .toFile(heroWebpPath);

  // 4. Also keep an optimized version of the full portrait.png just in case (compressed from 1.76MB to ~300KB)
  const optimizedFullPng = path.join(imagesDir, 'portrait-full.webp');
  await sharp(portraitPath)
    .resize(720, null)
    .webp({ quality: 82 })
    .toFile(optimizedFullPng);

  console.log('Original portrait.png: 1728 KB');
  console.log('portrait.webp (Hero): ' + Math.round(fs.statSync(heroWebpPath).size / 1024) + ' KB');
  console.log('portrait-avatar.webp: ' + Math.round(fs.statSync(avatarPath).size / 1024) + ' KB');

  console.log('--- Generating Favicons and Manifest ---');
  // Circular mask for favicon
  const favRaw = await sharp(portraitPath)
    .extract({ left: 100, top: 30, width: 740, height: 740 })
    .resize(512, 512)
    .toBuffer();

  const circleSvg = Buffer.from(
    `<svg width="512" height="512">
      <circle cx="256" cy="256" r="250" fill="#fff" />
    </svg>`
  );

  const ringSvg = Buffer.from(
    `<svg width="512" height="512">
      <circle cx="256" cy="256" r="248" fill="none" stroke="#8B5CF6" stroke-width="16" />
    </svg>`
  );

  const maskedFavicon = await sharp(favRaw)
    .composite([
      { input: circleSvg, blend: 'dest-in' },
      { input: ringSvg, blend: 'over' }
    ])
    .png()
    .toBuffer();

  await sharp(maskedFavicon).resize(512, 512).png().toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  await sharp(maskedFavicon).resize(192, 192).png().toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  await sharp(maskedFavicon).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(maskedFavicon).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(maskedFavicon).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(maskedFavicon).resize(48, 48).toFile(path.join(publicDir, 'favicon.ico'));

  console.log('--- Generating Open Graph Social Preview Image ---');
  // 1200x630 Open Graph preview
  const ogWidth = 1200;
  const ogHeight = 630;

  // Render Muhammad's photo at 420x420
  const ogAvatarBuffer = await sharp(portraitPath)
    .extract({ left: 40, top: 20, width: 860, height: 860 })
    .resize(400, 400)
    .composite([
      {
        input: Buffer.from(
          `<svg width="400" height="400">
            <circle cx="200" cy="200" r="195" fill="#fff" />
          </svg>`
        ),
        blend: 'dest-in'
      },
      {
        input: Buffer.from(
          `<svg width="400" height="400">
            <circle cx="200" cy="200" r="195" fill="none" stroke="#8B5CF6" stroke-width="8" />
          </svg>`
        ),
        blend: 'over'
      }
    ])
    .png()
    .toBuffer();

  const ogSvg = Buffer.from(
    `<svg width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad1" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#050711" stop-opacity="1"/>
        </radialGradient>
        <radialGradient id="grad2" cx="80%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#050711" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="50%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#A78BFA"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${ogWidth}" height="${ogHeight}" fill="#050711"/>
      <rect width="${ogWidth}" height="${ogHeight}" fill="url(#grad1)"/>
      <rect width="${ogWidth}" height="${ogHeight}" fill="url(#grad2)"/>

      <!-- Border Frame -->
      <rect x="24" y="24" width="${ogWidth - 48}" height="${ogHeight - 48}" rx="24" fill="none" stroke="rgba(139, 92, 246, 0.25)" stroke-width="2"/>

      <!-- Badge -->
      <rect x="80" y="90" width="220" height="38" rx="19" fill="rgba(124, 58, 237, 0.15)" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1"/>
      <text x="100" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600" fill="#A78BFA">PORTFOLIO &amp; SHOWCASE</text>

      <!-- Name -->
      <text x="80" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" fill="#FFFFFF" letter-spacing="-1">Muhammad</text>
      <text x="80" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" fill="url(#purpleGrad)" letter-spacing="-1">Mubashir</text>

      <!-- Role / Subtitle -->
      <text x="80" y="340" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="bold" fill="#E2E8F0">Web Developer | MERN Stack Developer</text>

      <!-- Description line -->
      <text x="80" y="395" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="normal" fill="#94A3B8">Building scalable, responsive &amp; performant digital experiences.</text>

      <!-- Skill Pills -->
      <rect x="80" y="450" width="90" height="36" rx="8" fill="#0D101C" stroke="rgba(255,255,255,0.1)"/>
      <text x="125" y="473" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#CBD5E1">React</text>

      <rect x="180" y="450" width="100" height="36" rx="8" fill="#0D101C" stroke="rgba(255,255,255,0.1)"/>
      <text x="230" y="473" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#CBD5E1">Node.js</text>

      <rect x="290" y="450" width="105" height="36" rx="8" fill="#0D101C" stroke="rgba(255,255,255,0.1)"/>
      <text x="342" y="473" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#CBD5E1">Express</text>

      <rect x="405" y="450" width="110" height="36" rx="8" fill="#0D101C" stroke="rgba(255,255,255,0.1)"/>
      <text x="460" y="473" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#CBD5E1">MongoDB</text>

      <rect x="525" y="450" width="115" height="36" rx="8" fill="#0D101C" stroke="rgba(255,255,255,0.1)"/>
      <text x="582" y="473" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#CBD5E1">Bootstrap</text>

      <!-- Footer URL -->
      <text x="80" y="550" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#8B5CF6">mubashir-webdev.github.io</text>
    </svg>`
  );

  const ogFinal = await sharp(ogSvg)
    .composite([
      {
        input: ogAvatarBuffer,
        top: 115,
        left: 710
      }
    ])
    .png({ quality: 90 })
    .toFile(path.join(imagesDir, 'og-image.png'));

  console.log('OG image created: ' + Math.round(fs.statSync(path.join(imagesDir, 'og-image.png')).size / 1024) + ' KB');
  console.log('All image optimization complete!');
}

processAll().catch(err => {
  console.error(err);
  process.exit(1);
});
