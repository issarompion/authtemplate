import {Component, OnInit} from "@angular/core";
import {IUser} from "../../models/entities";
import {HttpService} from "../../services/http.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  loading = false;
  users: IUser[];

  constructor(private httpService: HttpService) { }

  ngOnInit() {
      this.loading = true;
      this.httpService.getUsers()
      .subscribe(users =>{
        this.loading = false;
        this.users = users;
      })
  }

}
