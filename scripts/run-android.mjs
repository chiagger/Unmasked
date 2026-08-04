import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const androidStudioJdks = [
  '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
  '/Applications/Android Studio Preview.app/Contents/jbr/Contents/Home',
];

const javaHome =
  process.env.JAVA_HOME || androidStudioJdks.find((candidate) => existsSync(candidate));

if (!javaHome) {
  console.error(
    'Java non trovato. Installa Android Studio oppure configura JAVA_HOME prima di eseguire npm run android.',
  );
  process.exit(1);
}

const result = spawnSync('expo', ['run:android', '--port', '0'], {
  env: {
    ...process.env,
    EXPO_UNSTABLE_HEADLESS: '1',
    JAVA_HOME: javaHome,
    PATH: `${javaHome}/bin:${process.env.PATH ?? ''}`,
  },
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
