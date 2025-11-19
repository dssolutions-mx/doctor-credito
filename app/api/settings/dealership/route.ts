import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/api-helpers'

export async function GET(request: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    
    // Fetch dealership information
    // For dealers, fetch their dealership
    // For agents, fetch their assigned dealership
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, metadata')
      .eq('id', user.id)
      .single()

    let dealership = null

    if (profile?.role === 'dealer') {
      // Fetch dealer's own dealership
      const { data: dealerData } = await supabase
        .from('dealers')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      dealership = dealerData
    } else {
      // For agents, check if they have an assigned dealership in metadata
      dealership = profile?.metadata?.dealership || null
    }

    return NextResponse.json({ dealership })
  } catch (error) {
    console.error('Error fetching dealership:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { user, error: authError } = await getAuthenticatedUser()
    if (authError || !user) {
      return unauthorizedResponse()
    }

    const supabase = await createClient()
    const dealershipData = await request.json()

    // Get current profile
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role, metadata')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role === 'dealer') {
      // Update dealer's dealership record
      const { data: dealerRecord } = await supabase
        .from('dealers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (dealerRecord) {
        // Update existing dealership
        const { error } = await supabase
          .from('dealers')
          .update({
            name: dealershipData.name,
            address: dealershipData.address,
            city: dealershipData.city,
            state: dealershipData.state,
            zip: dealershipData.zip,
            phone: dealershipData.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', dealerRecord.id)

        if (error) {
          console.error('Error updating dealership:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      } else {
        // Create new dealership record
        const { error } = await supabase
          .from('dealers')
          .insert({
            user_id: user.id,
            name: dealershipData.name,
            address: dealershipData.address,
            city: dealershipData.city,
            state: dealershipData.state,
            zip: dealershipData.zip,
            phone: dealershipData.phone,
          })

        if (error) {
          console.error('Error creating dealership:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      }
    } else {
      // For agents, store in metadata
      const currentMetadata = currentProfile?.metadata || {}
      const updatedMetadata = {
        ...currentMetadata,
        dealership: dealershipData,
      }

      const { error } = await supabase
        .from('profiles')
        .update({ metadata: updatedMetadata })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating dealership metadata:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, dealership: dealershipData })
  } catch (error) {
    console.error('Error updating dealership:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

