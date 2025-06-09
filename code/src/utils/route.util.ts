import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const loadRoutes = (app: Router) => {
    const routesPath = path.join(__dirname, '../routes');
    
    // Get all version folders first
    const versionFolders = fs.readdirSync(routesPath)
        .filter(item => fs.statSync(path.join(routesPath, item)).isDirectory());
    
    // Load routes for each version
    versionFolders.forEach(version => {
        const versionPath = path.join(routesPath, version);
        
        // Get all route files in the version folder
        const routeFiles = fs.readdirSync(versionPath)
            .filter(file => file.endsWith('.route.ts') || file.endsWith('.route.js'));

        // Load each route file
        routeFiles.forEach(file => {
            const routePath = path.join(versionPath, file);
            const route = require(routePath).default;
            
            // Extract route name from filename (e.g., users.route.ts -> users)
            const fileName = file.split('.')[0];
            console.log(`api/${version}/${fileName}`);
            // Mount the route
            app.use(`/api/${version}/${fileName}`, route);
        });
    });
}; 