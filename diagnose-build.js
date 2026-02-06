const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- DIAGNOSTIC TABOULOU ERP ---');
console.log('Date:', new Date().toLocaleString());

function checkCommand(cmd) {
    try {
        const output = execSync(cmd, { stdio: 'pipe' }).toString().trim();
        console.log(`[OK] ${cmd}: ${output}`);
        return true;
    } catch (e) {
        console.log(`[ERROR] ${cmd} échoué.`);
        return false;
    }
}

// 1. Système & Outils
console.log('\n1. Vérification du système :');
console.log('OS:', process.platform);
checkCommand('node -v');
checkCommand('npm -v');

// 2. Environnement
console.log('\n2. Vérification du fichier .env :');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const hasDB = content.includes('DATABASE_URL');
    const hasSupabase = content.includes('NEXT_PUBLIC_SUPABASE');
    console.log(`[OK] .env trouvé.`);
    console.log(`[${hasDB ? 'OK' : 'MISSING'}] DATABASE_URL`);
    console.log(`[${hasSupabase ? 'OK' : 'MISSING'}] Supabase Keys`);
} else {
    console.log('[CRITICAL] Fichier .env manquant !');
}

// 3. Prisma
console.log('\n3. Vérification de Prisma :');
checkCommand('npx prisma -v');

// 4. Test de Build (Capture de l'erreur exacte)
console.log('\n4. Tentative de Build (Analyse de l\'erreur) :');
console.log('Exécution de "npm run build"... Patientez...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\n[SUCCÈS] Le build a fonctionné cette fois-ci !');
} catch (e) {
    console.log('\n[ÉCHEC] Le build a encore échoué.');
    console.log('CONSEIL : Si vous voyez des erreurs de type (TypeScript), donnez-moi les premières lignes.');
}

console.log('\n--- FIN DU DIAGNOSTIC ---');
