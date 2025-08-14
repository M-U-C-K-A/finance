// actions/user.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth-server'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string | null
    const avatarFile = formData.get('avatar') as File | null

    // Données à mettre à jour
    const updateData: any = {
      name: name.trim()
    }

    // Gestion de l'email (seulement pour les comptes non-OAuth)
    if (email && email.trim()) {
      // TODO: Vérifier que ce n'est pas un compte OAuth
      updateData.email = email.trim()
      // TODO: Marquer l'email comme non-vérifié si changé
      updateData.emailVerified = false
    }

    // Gestion de l'avatar
    if (avatarFile && avatarFile.size > 0) {
      // Vérifier la taille (max 2MB)
      if (avatarFile.size > 2 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 2MB')
      }

      // Vérifier le type
      if (!avatarFile.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
      }

      // Créer le dossier avatars s'il n'existe pas
      const uploadsDir = join(process.cwd(), 'public', 'avatars')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (error) {
        // Le dossier existe déjà
      }

      // Générer un nom de fichier unique
      const extension = avatarFile.name.split('.').pop()
      const filename = `${user.id}-${randomUUID()}.${extension}`
      const filepath = join(uploadsDir, filename)

      // Sauvegarder le fichier
      const bytes = await avatarFile.arrayBuffer()
      await writeFile(filepath, Buffer.from(bytes))

      // Mettre à jour le chemin de l'avatar
      updateData.image = `/avatars/${filename}`
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    revalidatePath('/settings')
    return { success: true, user: updatedUser }
    
  } catch (error: any) {
    console.error('Update profile error:', error)
    throw new Error(error.message || 'Erreur lors de la mise à jour du profil')
  }
}

export async function updateUserPassword(formData: FormData) {
  try {
    const user = await getUser()
    if (!user) {
      throw new Error('Utilisateur non authentifié')
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Vérifications
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('Tous les champs sont requis')
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas')
    }

    if (newPassword.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères')
    }

    // TODO: Vérifier le mot de passe actuel avec Better Auth
    // TODO: Mettre à jour le mot de passe avec Better Auth
    
    // Pour l'instant, on simule la réussite
    console.log('Password update requested for user:', user.id)
    
    revalidatePath('/settings')
    return { success: true }
    
  } catch (error: any) {
    console.error('Update password error:', error)
    throw new Error(error.message || 'Erreur lors de la mise à jour du mot de passe')
  }
}
