import { spawn, SpawnOptions } from 'child_process';

export default async function (
    command: string,
    args: string[] = [],
    options: SpawnOptions = {}
): Promise<[string, string]> {
    const stdout: string[] = [];
    const stderr: string[] = [];

    return await new Promise((resolve, reject) => {
        const process = spawn(command, args, options);

        process.stdout?.on('data', stdout.push.bind(stdout));
        process.stderr?.on('data', stderr.push.bind(stderr));

        process.on('close', () => resolve([stdout.join(''), stderr.join('')]));
        process.on('error', reject);
    });
}
