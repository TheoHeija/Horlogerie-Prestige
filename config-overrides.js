const { override, addBabelPreset, babelInclude } = require('customize-cra');
const path = require('path');

module.exports = override(
  // Add @babel/preset-react to the Babel configuration
  addBabelPreset('@babel/preset-react'),
  
  // Include the react-sparklines package in the Babel transformation
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/react-sparklines')
  ])
); 