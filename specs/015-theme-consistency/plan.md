# Theme Consistency Implementation Plan

## Goal
Ensure all components properly support Docusaurus light and dark themes by replacing hardcoded colors with theme variables and making visual elements theme-responsive.

## Approach

### Phase 1: Audit & Analysis
1. Identify all hardcoded colors in component styles
2. Map hardcoded colors to appropriate Docusaurus theme variables
3. Document current theme behavior
4. Identify visual elements that need theme adaptation (logos, icons)

### Phase 2: Component Updates

#### Background Colors
1. **HomepageFeatures**
   - Replace `#2b2b2b` with `var(--ifm-background-surface-color)`

2. **RagSection**
   - Replace `#1b1b1b` with `var(--ifm-background-color)`

3. **CurriculumSection**
   - Replace `#1b1b1b` with `var(--ifm-background-surface-color)`

4. **TechStackSection**
   - Verify existing theme variable usage
   - No changes needed (already theme-responsive)

#### Visual Elements
1. **Logo/Icons**
   - Apply CSS filters to robot icon
   - Light mode: Green tint matching primary color
   - Dark mode: Teal tint matching dark primary color
   - Add smooth transition between themes

### Phase 3: Testing & Verification
1. Toggle theme switcher
2. Verify all sections adapt properly
3. Check text contrast ratios (WCAG AA)
4. Test interactive states in both themes
5. Verify logo color changes

## Theme Variables Mapping

### Backgrounds
- Main background: `var(--ifm-background-color)`
- Surface/section: `var(--ifm-background-surface-color)`
- Cards: `var(--ifm-card-background-color)`

### Text
- Primary: `var(--ifm-font-color-base)`
- Secondary: `var(--ifm-color-content-secondary)`
- Content: `var(--ifm-color-content)`

### Brand Colors
- Primary: `var(--ifm-color-primary)`
- Primary dark: `var(--ifm-color-primary-dark)`
- Primary light: `var(--ifm-color-primary-light)`

### UI Elements
- Borders: `var(--ifm-color-emphasis-200)`
- Subtle backgrounds: `var(--ifm-color-emphasis-100)`
- Muted elements: `var(--ifm-color-emphasis-300)`

## Technical Implementation

### CSS Filter for Logo
```css
/* Light mode - Green tint */
.navbar__logo img {
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) 
          saturate(500%) hue-rotate(120deg) brightness(95%) contrast(91%);
  transition: filter 0.3s ease;
}

/* Dark mode - Teal tint */
[data-theme='dark'] .navbar__logo img {
  filter: brightness(0) saturate(100%) invert(77%) sepia(26%) 
          saturate(1000%) hue-rotate(120deg) brightness(95%) contrast(85%);
}
```

### Files to Modify
- `src/components/HomepageFeatures/styles.module.css`
- `src/components/RagSection/styles.module.css`
- `src/components/CurriculumSection/styles.module.css`
- `src/css/custom.css`

## Color Palette

### Light Mode
- Primary: `#2e8555` (Green)
- Background: Light gray/white
- Text: Dark gray/black
- Cards: White
- Borders: Light gray

### Dark Mode
- Primary: `#25c2a0` (Teal)
- Background: Dark gray/black
- Text: Light gray/white
- Cards: Dark gray
- Borders: Dark gray

## Success Metrics
- Zero hardcoded colors in components
- All components use Docusaurus theme variables
- Smooth theme transitions (< 300ms)
- WCAG AA contrast ratios met
- Logo/icons adapt to theme
- Consistent visual hierarchy in both modes

## Accessibility Requirements
- Normal text contrast: ≥ 4.5:1
- Large text contrast: ≥ 3:1
- Focus indicators visible in both themes
- No color-only information

## Risks & Mitigation
- **Risk**: Poor contrast in one theme
  - **Mitigation**: Test with contrast checkers, use Docusaurus defaults
- **Risk**: Logo filter not working on all browsers
  - **Mitigation**: Test on major browsers, provide fallback
- **Risk**: Breaking existing color schemes
  - **Mitigation**: Test thoroughly before deployment

## Timeline
- Analysis: Completed
- Implementation: Completed
- Testing: In Progress
- Documentation: Completed
