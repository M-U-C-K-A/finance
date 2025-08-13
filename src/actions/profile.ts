// actions/profile.ts
'use server'

import { getUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: {
  name: string
  image?: string
  bio?: string
}) {
  const session = await getUser()
  if (!session?.user?.id) {
    throw new Error('Non authentifié')
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        image: data.image,
        bio: data.bio,
      },
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('Échec de la mise à jour du profil')
  }
}
