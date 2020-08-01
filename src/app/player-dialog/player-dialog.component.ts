import { Component, OnInit } from '@angular/core';
import { Country, SquadNumber } from '../interfaces/player';
import { PlayerService } from '../services/player.service';
import { TeamService } from '../services/team.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  private team;
  public player;
  public countries = Object.keys(Country).map(key => ({
    label: key,
    key: Country[key]
  }));
  public squadNumber = Object.keys(SquadNumber).slice(Object.keys(SquadNumber).length / 2)
  .map(key => ({
    label: key,
    key: SquadNumber[key]
  }));

  constructor(private playerService: PlayerService, private teamService: TeamService) { }

  ngOnInit(): void {
    this.teamService
    .getTeams()
    .pipe(take(1))
    .subscribe(teams => {
      if(teams.length > 0){
        this.team = teams[0];
      }
    });
  }

  private newPlayer(playerFormValue){
    const key = this.playerService.addPlayer(playerFormValue).key;
    const playerFormValueKey = {
      ...playerFormValue,
      key
    };

    const formattedTeam = {
      ...this.team,
      players: [...(this.team.players ? this.team.players : []), playerFormValueKey],
    };
    this.teamService.editTeam(formattedTeam);
  }

  onSubmit(playerForm: NgForm){
    const playerFormValue = {...playerForm.value};
    if (playerForm.valid){
      playerFormValue.leftFooted = playerFormValue.leftFooter === '' ? false : playerFormValue.leftFooter;
    }
    this.newPlayer(playerFormValue);
    window.location.replace('#');
  }
}
