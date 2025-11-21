import { NextResponse } from 'next/server';
import { createServerSupabase } from '../_supabaseserver';


export async function POST(req: Request) {
try {
const { title, content } = await req.json();
const supabase = createServerSupabase();


const { error } = await supabase.from('posts').insert([{ title, content }]);
if (error) {
console.error(error);
return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
}


return NextResponse.json({ ok: true });
} catch (err) {
console.error(err);
return NextResponse.json({ error: 'Server error' }, { status: 500 });
}
}