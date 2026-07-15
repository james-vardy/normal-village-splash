// Cloudflare Pages Function: POST /api/subscribe
// Adds a contact to the Mailjet list. Requires MAILJET_API_KEY,
// MAILJET_SECRET_KEY and MAILJET_LIST_ID set in the Pages project
// (Settings -> Variables and Secrets), or in .dev.vars for local dev.

interface Env {
	MAILJET_API_KEY: string;
	MAILJET_SECRET_KEY: string;
	MAILJET_LIST_ID: string;
}

const json = (body: object, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

export const onRequestPost = async (context: { request: Request; env: Env }) => {
	const { request, env } = context;

	let email = '';
	let name = '';
	try {
		const body = (await request.json()) as Record<string, unknown>;
		email = String(body.email ?? '').trim();
		name = String(body.name ?? '').trim();
	} catch {
		return json({ success: false, message: 'Bad request.' }, 400);
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ success: false, message: 'Please enter a valid email address.' }, 400);
	}

	if (!env.MAILJET_API_KEY || !env.MAILJET_SECRET_KEY || !env.MAILJET_LIST_ID) {
		return json({ success: false, message: 'Mailing list is not configured.' }, 500);
	}

	// "addnoforce" creates the contact if needed and adds it to the list,
	// but won't re-subscribe someone who previously unsubscribed.
	const res = await fetch(`https://api.mailjet.com/v3/REST/contactslist/${env.MAILJET_LIST_ID}/managecontact`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${btoa(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`)}`,
		},
		body: JSON.stringify({ Email: email, Name: name, Action: 'addnoforce' }),
	});

	if (!res.ok) {
		const errText = await res.text();
		if (res.status === 400 && /already|exist/i.test(errText)) {
			return json({ success: true, message: "You're already on the list!" });
		}
		console.error('Mailjet error:', res.status, errText);
		return json({ success: false, message: 'Something went wrong - please try again later.' }, 502);
	}

	return json({ success: true, message: "You're on the Mailing List." });
};
