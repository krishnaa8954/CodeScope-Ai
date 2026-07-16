const fs = require('fs');
const path = require('path');

const filePaths = ['src/pages/Dashboard.jsx', 'src/pages/Review.jsx', 'src/pages/Home.jsx'];
filePaths.forEach(file => {
  const fullPath = path.join('c:/Users/Acer/Desktop/Code scope ai/CodeScope-AI/frontend', file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;
  
  const replacements = [
    { regex: /(?<=\s)p-2(?=\s)/g, val: 'p-sm' },
    { regex: /(?<=\s)p-3(?=\s)/g, val: 'p-md' },
    { regex: /(?<=\s)p-4(?=\s)/g, val: 'p-md' },
    { regex: /(?<=\s)p-5(?=\s)/g, val: 'p-lg' },
    { regex: /(?<=\s)p-6(?=\s)/g, val: 'p-lg' },
    { regex: /(?<=\s)p-8(?=\s)/g, val: 'p-xl' },
    { regex: /(?<=\s)p-10(?=\s)/g, val: 'p-2xl' },
    { regex: /(?<=\s)px-2(?=\s)/g, val: 'px-sm' },
    { regex: /(?<=\s)px-3(?=\s)/g, val: 'px-md' },
    { regex: /(?<=\s)px-4(?=\s)/g, val: 'px-md' },
    { regex: /(?<=\s)px-5(?=\s)/g, val: 'px-lg' },
    { regex: /(?<=\s)px-6(?=\s)/g, val: 'px-lg' },
    { regex: /(?<=\s)px-8(?=\s)/g, val: 'px-xl' },
    { regex: /(?<=\s)py-2(?=\s)/g, val: 'py-sm' },
    { regex: /(?<=\s)py-3(?=\s)/g, val: 'py-md' },
    { regex: /(?<=\s)py-4(?=\s)/g, val: 'py-md' },
    { regex: /(?<=\s)py-5(?=\s)/g, val: 'py-lg' },
    { regex: /(?<=\s)py-6(?=\s)/g, val: 'py-lg' },
    { regex: /(?<=\s)py-8(?=\s)/g, val: 'py-xl' },
    { regex: /(?<=\s)gap-2(?=\s)/g, val: 'gap-sm' },
    { regex: /(?<=\s)gap-3(?=\s)/g, val: 'gap-md' },
    { regex: /(?<=\s)gap-4(?=\s)/g, val: 'gap-md' },
    { regex: /(?<=\s)gap-5(?=\s)/g, val: 'gap-lg' },
    { regex: /(?<=\s)gap-6(?=\s)/g, val: 'gap-lg' },
    { regex: /(?<=\s)gap-8(?=\s)/g, val: 'gap-xl' },
    { regex: /(?<=\s)mt-2(?=\s)/g, val: 'mt-sm' },
    { regex: /(?<=\s)mt-3(?=\s)/g, val: 'mt-md' },
    { regex: /(?<=\s)mt-4(?=\s)/g, val: 'mt-md' },
    { regex: /(?<=\s)mt-5(?=\s)/g, val: 'mt-lg' },
    { regex: /(?<=\s)mt-6(?=\s)/g, val: 'mt-lg' },
    { regex: /(?<=\s)mt-8(?=\s)/g, val: 'mt-xl' },
    { regex: /(?<=\s)mb-2(?=\s)/g, val: 'mb-sm' },
    { regex: /(?<=\s)mb-3(?=\s)/g, val: 'mb-md' },
    { regex: /(?<=\s)mb-4(?=\s)/g, val: 'mb-md' },
    { regex: /(?<=\s)mb-5(?=\s)/g, val: 'mb-lg' },
    { regex: /(?<=\s)mb-6(?=\s)/g, val: 'mb-lg' },
    { regex: /(?<=\s)mb-8(?=\s)/g, val: 'mb-xl' },
    { regex: /(?<=\s)space-y-1(?=\s)/g, val: 'space-y-xs' },
    { regex: /(?<=\s)space-y-2(?=\s)/g, val: 'space-y-sm' },
    { regex: /(?<=\s)space-y-3(?=\s)/g, val: 'space-y-md' },
    { regex: /(?<=\s)space-y-4(?=\s)/g, val: 'space-y-md' },
    { regex: /(?<=\s)space-y-5(?=\s)/g, val: 'space-y-lg' },
    { regex: /(?<=\s)space-y-6(?=\s)/g, val: 'space-y-lg' },
  ];
  
  replacements.forEach(rep => {
    content = content.replace(rep.regex, rep.val);
  });
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    console.log('Updated', fullPath);
  }
});
