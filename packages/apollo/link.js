#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const links = ['lib'];

links.forEach((folder) => {
    try {
        fs.symlinkSync(
            // Resolves to lib/index.js
            path.join(require.resolve('@jomobo/apollo-config'), '../..', folder),
            path.join(__dirname, folder),
            'dir',
        );
    } catch (error) {
        // Ignore
    }
});
