import React from 'react'
import fetchPlayers from '@/utils/fPlayers'
import LeaderBoard from './leaderBoard'

type milestoneType = { 
    Milestone_Id : number, 
    Milestone_Title : string, 
    Milestone_description : string , 
    UnlockingLevel : number, 
    UploadRequired : boolean, 
  }
  
  type playerType = { 
    Player_ID :number, 
    Player_name : string, 
    Playerpoint : number, 
    streak : number, 
    lastLogin : Date, 
    Level_Id ?: number,
    Milestone_Id ?: number , 
    milestone : milestoneType
  }
  
  type Players = playerType[]

  async function LeaderBoardSection() {
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* The title "Leaderboard Standing" is now handled in app/profile/page.tsx */}
        <LeaderBoard/>
      </div>
    );
  }

export default LeaderBoardSection
