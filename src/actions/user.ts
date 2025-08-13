// actions/user.ts
'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type UpdateProfileData = {
  userId: string
  name: string
  username: string
  bio?: string
}

export async function updateUserProfile(data: UpdateProfileData) {
  try {
    await prisma.user.update({
      where: { id: data.userId },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio
      }
    })
    
    revalidatePath('/settings/profile')
    return { success: true }
  } catch (error) {
    console.error('Update profile error:', error)
    throw new Error('Erreur lors de la mise à jour du profil')
  }
}
