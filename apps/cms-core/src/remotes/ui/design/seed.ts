const colorPalettes = {
  blue: {
    default: '#1677FF',
    1: '#e6f4ff', 2: '#bae0ff', 3: '#91caff', 4: '#69b1ff', 5: '#4096ff',
    6: '#1677ff', 7: '#0958d9', 8: '#003eb3', 9: '#002c8c', 10: '#001d66',
  },
  purple: {
    default: '#722ED1',
    1: '#f9f0ff', 2: '#efdbff', 3: '#d3adf7', 4: '#b37feb', 5: '#9254de',
    6: '#722ed1', 7: '#531dab', 8: '#391085', 9: '#22075e', 10: '#120338',
  },
  cyan: {
    default: '#13C2C2',
    1: '#e6fffb', 2: '#b5f5ec', 3: '#87e8de', 4: '#5cdbd3', 5: '#36cfc9',
    6: '#13c2c2', 7: '#08979c', 8: '#006d75', 9: '#00474f', 10: '#002329',
  },
  green: {
    default: '#52C41A',
    1: '#f6ffed', 2: '#d9f7be', 3: '#b7eb8f', 4: '#95de64', 5: '#73d13d',
    6: '#52c41a', 7: '#389e0d', 8: '#237804', 9: '#135200', 10: '#092b00',
  },
  magenta: {
    default: '#EB2F96',
    1: '#fff0f6', 2: '#ffd6e7', 3: '#ffadd2', 4: '#ff85c0', 5: '#f759ab',
    6: '#eb2f96', 7: '#c41d7f', 8: '#9e1068', 9: '#780650', 10: '#520339',
  },
  pink: {
    default: '#EB2F96',
    1: '#fff0f6', 2: '#ffd6e7', 3: '#ffadd2', 4: '#ff85c0', 5: '#f759ab',
    6: '#eb2f96', 7: '#c41d7f', 8: '#9e1068', 9: '#780650', 10: '#520339',
  },
  red: {
    default: '#F5222D',
    1: '#fff1f0', 2: '#ffccc7', 3: '#ffa39e', 4: '#ff7875', 5: '#ff4d4f',
    6: '#f5222d', 7: '#cf1322', 8: '#a8071a', 9: '#820014', 10: '#5c0011',
  },
  orange: {
    default: '#FA8C16',
    1: '#fff7e6', 2: '#ffe7ba', 3: '#ffd591', 4: '#ffc069', 5: '#ffa940',
    6: '#fa8c16', 7: '#d46b08', 8: '#ad4e00', 9: '#873800', 10: '#612500',
  },
  yellow: {
    default: '#FADB14',
    1: '#feffe6', 2: '#ffffb8', 3: '#fffb8f', 4: '#fff566', 5: '#ffec3d',
    6: '#fadb14', 7: '#d4b106', 8: '#ad8b00', 9: '#876800', 10: '#614700',
  },
  volcano: {
    default: '#FA541C',
    1: '#fff2e8', 2: '#ffd8bf', 3: '#ffbb96', 4: '#ff9c6e', 5: '#ff7a45',
    6: '#fa541c', 7: '#d4380d', 8: '#ad2102', 9: '#871400', 10: '#610b00',
  },
  geekblue: {
    default: '#2F54EB',
    1: '#f0f5ff', 2: '#d6e4ff', 3: '#adc6ff', 4: '#85a5ff', 5: '#597ef7',
    6: '#2f54eb', 7: '#1d39c4', 8: '#10239e', 9: '#061178', 10: '#030852',
  },
  gold: {
    default: '#FAAD14',
    1: '#fffbe6', 2: '#fff1b8', 3: '#ffe58f', 4: '#ffd666', 5: '#ffc53d',
    6: '#faad14', 7: '#d48806', 8: '#ad6800', 9: '#874d00', 10: '#613400',
  },
  lime: {
    default: '#A0D911',
    1: '#fcffe6', 2: '#f4ffb8', 3: '#eaff8f', 4: '#d3f261', 5: '#bae637',
    6: '#a0d911', 7: '#7cb305', 8: '#5b8c00', 9: '#3f6600', 10: '#254000',
  },
}

export const defaultSeedTokenKey = {
  // Color palette
  ...colorPalettes,
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',
  colorLink: '#1677ff',
  colorTextBase: '#000',
  colorBgBase: '#fff',
  fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, \'Noto Sans\', sans-serif, \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Segoe UI Symbol\', \'Noto Color Emoji\'',
  fontFamilyCode: '\'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, Courier, monospace',
  fontSize: '14px',
  lineWidth: '1px',
  lineType: 'solid',
  motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
  motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  motionEaseOutBack: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
  motionEaseInBack: 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
  motionEaseInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  motionEaseOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  borderRadius: '6px',
  sizePopupArrow: '16px',
  controlHeight: '32px',
  zIndexBase: 0,
  zIndexPopupBase: 1000,
  opacityImage: 1,

  // Text colors
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
  colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',

  // Fill colors
  colorFill: {
    default: 'rgba(0, 0, 0, 0.15)',
    secondary: 'rgba(0, 0, 0, 0.06)',
    tertiary: 'rgba(0, 0, 0, 0.04)',
    quaternary: 'rgba(0, 0, 0, 0.02)',
    content: 'rgba(0, 0, 0, 0.06)',
    contentHover: 'rgba(0, 0, 0, 0.15)',
    alter: 'rgba(0, 0, 0, 0.02)',
  },

  // Background colors
  colorBgSolid: 'rgb(0, 0, 0)',
  colorBgSolidHover: 'rgba(0, 0, 0, 0.75)',
  colorBgSolidActive: 'rgba(0, 0, 0, 0.95)',
  colorBgLayout: '#f5f5f5',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBgSpotlight: 'rgba(0, 0, 0, 0.85)',
  colorBgBlur: 'transparent',
  colorBgContainerDisabled: 'rgba(0, 0, 0, 0.04)',
  colorBgTextHover: 'rgba(0, 0, 0, 0.06)',
  colorBgTextActive: 'rgba(0, 0, 0, 0.15)',
  colorBgMask: 'rgba(0, 0, 0, 0.45)',

  // Border colors
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
  colorBorderBg: '#ffffff',
  colorSplit: 'rgba(5, 5, 5, 0.06)',

  // Status colors
  color: {
    primary: {
      bg: '#e6f4ff',
      bgHover: '#bae0ff',
      border: '#91caff',
      borderHover: '#69b1ff',
      hover: '#4096ff',
      active: '#0958d9',
      textHover: '#4096ff',
      text: '#1677ff',
      textActive: '#0958d9',
    },
    success: {
      bg: '#f6ffed',
      bgHover: '#d9f7be',
      border: '#b7eb8f',
      borderHover: '#95de64',
      hover: '#95de64',
      active: '#389e0d',
      textHover: '#73d13d',
      text: '#52c41a',
      textActive: '#389e0d',
    },
    error: {
      bg: '#fff2f0',
      bgHover: '#fff1f0',
      bgFilledHover: '#ffdfdc',
      bgActive: '#ffccc7',
      border: '#ffccc7',
      borderHover: '#ffa39e',
      hover: '#ff7875',
      active: '#d9363e',
      textHover: '#ff7875',
      text: '#ff4d4f',
      textActive: '#d9363e',
      outline: 'rgba(255, 38, 5, 0.06)',
    },
    warning: {
      bg: '#fffbe6',
      bgHover: '#fff1b8',
      border: '#ffe58f',
      borderHover: '#ffd666',
      hover: '#ffd666',
      active: '#d48806',
      textHover: '#ffc53d',
      text: '#faad14',
      textActive: '#d48806',
      outline: 'rgba(255, 215, 5, 0.1)',
    },
    info: {
      bg: '#e6f4ff',
      bgHover: '#bae0ff',
      border: '#91caff',
      borderHover: '#69b1ff',
      hover: '#69b1ff',
      active: '#0958d9',
      textHover: '#4096ff',
      text: '#1677ff',
      textActive: '#0958d9',
    },

    // Link colors
    link: {
      hover: '#69b1ff',
      active: '#0958d9',
    },
  },

  // Typography
  colorWhite: '#fff',
  colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)',
  colorTextDisabled: 'rgba(0, 0, 0, 0.25)',
  colorTextHeading: 'rgba(0, 0, 0, 0.88)',
  colorTextLabel: 'rgba(0, 0, 0, 0.65)',
  colorTextDescription: 'rgba(0, 0, 0, 0.45)',
  colorTextLightSolid: '#fff',
  colorHighlight: '#ff4d4f',
  colorIcon: 'rgba(0, 0, 0, 0.45)',
  colorIconHover: 'rgba(0, 0, 0, 0.88)',

  // Font sizes
  fontSizeSm: '12px',
  fontSizeLg: '16px',
  fontSizeXl: '20px',
  fontSizeHeading: {
    1: '38px',
    2: '30px',
    3: '24px',
    4: '20px',
    5: '16px',
  },
  fontSizeIcon: '12px',

  // Line heights
  lineHeight: 1.5714285714285714,
  lineHeightLg: 1.5,
  lineHeightSm: 1.6666666666666667,
  fontHeight: '22px',
  fontHeightLg: '24px',
  fontHeightSm: '20px',
  lineHeightHeading1: 1.2105263157894737,
  lineHeightHeading2: 1.2666666666666666,
  lineHeightHeading3: 1.3333333333333333,
  lineHeightHeading4: 1.4,
  lineHeightHeading5: 1.5,

  // Font weight
  fontWeightStrong: 600,

  // Control sizes
  controlHeightSm: '24px',
  controlHeightXs: '16px',
  controlHeightLg: '40px',

  // Motion
  motionDurationFast: '0.1s',
  motionDurationMid: '0.2s',
  motionDurationSlow: '0.3s',

  // Line widths
  lineWidthBold: '2px',
  lineWidthFocus: '3px',

  // Border radius
  borderRadiusXs: '2px',
  borderRadiusSm: '4px',
  borderRadiusLg: '8px',
  borderRadiusOuter: '4px',

  // Control
  controlOutlineWidth: '2px',
  controlInteractiveSize: '16px',
  controlItemBgHover: 'rgba(0, 0, 0, 0.04)',
  controlItemBgActive: '#e6f4ff',
  controlItemBgActiveHover: '#bae0ff',
  controlItemBgActiveDisabled: 'rgba(0, 0, 0, 0.15)',
  controlTmpOutline: 'rgba(0, 0, 0, 0.02)',
  controlOutline: 'rgba(5, 145, 255, 0.2)',

  // Opacity
  opacityLoading: 0.65,

  // Link
  linkDecoration: 'none',
  linkHoverDecoration: 'none',
  linkFocusDecoration: 'none',

  // Padding
  controlPaddingHorizontal: '12px',
  controlPaddingHorizontalSm: '8px',
  paddingXxs: '4px',
  paddingXs: '8px',
  paddingSm: '12px',
  padding: '16px',
  paddingMd: '20px',
  paddingLg: '24px',
  paddingXl: '32px',
  paddingContentHorizontalLg: '24px',
  paddingContentVerticalLg: '16px',
  paddingContentHorizontal: '16px',
  paddingContentVertical: '12px',
  paddingContentHorizontalSm: '16px',
  paddingContentVerticalSm: '8px',

  // Margin
  marginXxs: '4px',
  marginXs: '8px',
  marginSm: '12px',
  margin: '16px',
  marginMd: '20px',
  marginLg: '24px',
  marginXl: '32px',
  marginXxl: '48px',

  // Box shadows
  boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
  boxShadowPopoverArrow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
  boxShadowCard: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
  boxShadowDrawer: {
    right: '-6px 0 16px 0 rgba(0, 0, 0, 0.08), -3px 0 6px -4px rgba(0, 0, 0, 0.12), -9px 0 28px 8px rgba(0, 0, 0, 0.05)',
    left: '6px 0 16px 0 rgba(0, 0, 0, 0.08), 3px 0 6px -4px rgba(0, 0, 0, 0.12), 9px 0 28px 8px rgba(0, 0, 0, 0.05)',
    up: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    down: '0 -6px 16px 0 rgba(0, 0, 0, 0.08), 0 -3px 6px -4px rgba(0, 0, 0, 0.12), 0 -9px 28px 8px rgba(0, 0, 0, 0.05)',
  },
  boxShadowTabsOverflow: {
    left: 'inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)',
    right: 'inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)',
    top: 'inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)',
    bottom: 'inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)',
  },
}

export type SeedToken = typeof defaultSeedTokenKey
