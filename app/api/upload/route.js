import { uploadImage } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return Response.json({ message: "No image provided" }, { status: 400 });
    }

    const result = await uploadImage(image);

    return Response.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
