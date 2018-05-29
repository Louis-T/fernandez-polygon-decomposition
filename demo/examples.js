export const generateContourList = (maxWidth, maxHeight) => {
  return [
    [
      { x: 0.1 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.9 * maxHeight },
      { x: 0.1 * maxWidth, y: 0.9 * maxHeight },
    ],
    [
      { x: 0.1 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.5 * maxWidth, y: 0.3 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.9 * maxHeight },
      { x: 0.5 * maxWidth, y: 0.7 * maxHeight },
      { x: 0.1 * maxWidth, y: 0.9 * maxHeight },
    ],
    [
      { x: 0.1 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.3 * maxWidth, y: 0.2 * maxHeight },
      { x: 0.5 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.7 * maxWidth, y: 0.2 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.1 * maxHeight },
      { x: 0.8 * maxWidth, y: 0.3 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.5 * maxHeight },
      { x: 0.8 * maxWidth, y: 0.7 * maxHeight },
      { x: 0.9 * maxWidth, y: 0.9 * maxHeight },
      { x: 0.7 * maxWidth, y: 0.8 * maxHeight },
      { x: 0.5 * maxWidth, y: 0.9 * maxHeight },
      { x: 0.3 * maxWidth, y: 0.8 * maxHeight },
      { x: 0.1 * maxWidth, y: 0.9 * maxHeight },
      { x: 0.2 * maxWidth, y: 0.7 * maxHeight },
      { x: 0.1 * maxWidth, y: 0.5 * maxHeight },
      { x: 0.2 * maxWidth, y: 0.3 * maxHeight },
    ],
    [
      { x: 0.3 * maxWidth, y: 0.3 * maxHeight },
      { x: 0.7 * maxWidth, y: 0.3 * maxHeight },
      { x: 0.7 * maxWidth, y: 0.7 * maxHeight },
      { x: 0.3 * maxWidth, y: 0.7 * maxHeight },
    ],
  ];
};

export const generateHolesList = (maxWidth, maxHeight) => {
  return [
    [],
    [
      [
        { x: 0.4 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.6 * maxHeight },
      ],
    ],
    [
      [
        { x: 0.5 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.5 * maxHeight },
        { x: 0.5 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.5 * maxHeight },
      ],
    ],
    [
      [
        { x: 0.3 * maxWidth, y: 0.3 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.3 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.3 * maxWidth, y: 0.4 * maxHeight },
      ],
      [
        { x: 0.6 * maxWidth, y: 0.3 * maxHeight },
        { x: 0.7 * maxWidth, y: 0.3 * maxHeight },
        { x: 0.7 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.4 * maxHeight },
      ],
      [
        { x: 0.6 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.7 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.7 * maxWidth, y: 0.7 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.7 * maxHeight },
      ],
      [
        { x: 0.3 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.7 * maxHeight },
        { x: 0.3 * maxWidth, y: 0.7 * maxHeight },
      ],
    ],
    [
      [
        { x: 0.4 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.45 * maxWidth, y: 0.5 * maxHeight },
        { x: 0.55 * maxWidth, y: 0.5 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.4 * maxHeight },
        { x: 0.55 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.5 * maxWidth, y: 0.55 * maxHeight },
        { x: 0.45 * maxWidth, y: 0.6 * maxHeight },
      ],
    ],
    [
      [
        { x: 0.3 * maxWidth, y: 0.3 * maxHeight },
        { x: 0.4 * maxWidth, y: 0.3 * maxHeight },
        { x: 0.5 * maxWidth, y: 0.5 * maxHeight },
        { x: 0.3 * maxWidth, y: 0.4 * maxHeight },
      ],
      [
        { x: 0.5 * maxWidth, y: 0.5 * maxHeight },
        { x: 0.7 * maxWidth, y: 0.6 * maxHeight },
        { x: 0.7 * maxWidth, y: 0.7 * maxHeight },
        { x: 0.6 * maxWidth, y: 0.7 * maxHeight },
      ],
    ]
  ];
};
