import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
    const { filename } = params;
    const filePath = path.join(process.cwd(), 'files', 'profile-images', filename);

    if (!fs.existsSync(filePath)) {
        // ใช้รูป placeholder หากไฟล์หาย
        const placeholderPath = path.join(process.cwd(),'files', 'profile-images', 'placeholder.png');
        const placeholder = fs.readFileSync(placeholderPath);

        return new Response(placeholder, {
            headers: {
                'Content-Type': 'image/png',
            },
        });
    }

    const file = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

    return new Response(file, {
        headers: {
            'Content-Type': contentType,
        },
    });
}
