# Functions
## Connection
 - ### Connect
   - Syntax:
      ```
      rotur connect  

      rotur:connect()
      ```
   - Usage:
connect to rotur
 - ### Disconnect
   - Syntax:
      ```
      rotur disconnect  

      rotur:disconnect()
      ```
   - Usage:
disconnect from rotur
 - ### Server_online
   - Syntax:
      ```
      rotur server_online  

      rotur:server_online()
      ```
   - Usage:
check if the server is online
   - Other:
     - Returns a value
 - ### Connected
   - Syntax:
      ```
      rotur connected  

      rotur:connected()
      ```
   - Usage:
check if your connected
   - Other:
     - Returns a value
## User
 - ### Login
   - Syntax:
      ```
      rotur login user: string password: string 

      rotur:login(user: string, password: string)
      ```
   - Usage:
log into an account
   - Other:
     - Returns a value
 - ### Register
   - Syntax:
      ```
      rotur register user: string password: string 

      rotur:register(user: string, password: string)
      ```
   - Usage:
creates an account
   - Other:
     - Returns a value
 - ### Logout
   - Syntax:
      ```
      rotur logout  

      rotur:logout()
      ```
   - Usage:
logs out from the account

 - ### Logged_in
   - Syntax:
      ```
      rotur logged_in  

      rotur:logged_in()
      ```
   - Usage:
check if your logged in
   - Other:
     - Returns a value
 - ### Get_key
   - Syntax:
      ```
      rotur get_key key: string 

      rotur:get_key(key: string)
      ```
   - Usage:
gets key from user's data
   - Other:
     - Returns a value
 - ### Set_key
   - Syntax:
      ```
      rotur set_key key: string value: string 

      rotur:set_key(key: string, value: string)
      ```
   - Usage:
sets key in user's data
   - Other:
     - Returns a value
 - ### Has_key
   - Syntax:
      ```
      rotur has_key key: string 

      rotur:has_key(key: string)
      ```
   - Usage:
check if key exists in user's data
   - Other:
     - Returns a value
 - ### Get_keys
   - Syntax:
      ```
      rotur get_keys  

      rotur:get_keys()
      ```
   - Usage:
gets all the user's data keys
   - Other:
     - Returns a value
 - ### Get_values
   - Syntax:
      ```
      rotur get_values  

      rotur:get_values()
      ```
   - Usage:
gets all the user's data values
   - Other:
     - Returns a value
 - ### Get_acc
   - Syntax:
      ```
      rotur get_acc  

      rotur:get_acc()
      ```
   - Usage:
gets the user's data as an object
   - Other:
     - Returns a value
## Storage
 - ### Storage_set_id
   - Syntax:
      ```
      rotur storage_set_id id: string 

      rotur:storage_set_id(id: string)
      ```
   - Usage:
sets the storage id
 - ### Storage_is_set
   - Syntax:
      ```
      rotur storage_is_set  

      rotur:storage_is_set()
      ```
   - Usage:
checks if the storage id is set
   - Other:
     - Returns a value
 - ### Storage_id
   - Syntax:
      ```
      rotur storage_id  

      rotur:storage_id()
      ```
   - Usage:
gets the current storage id
   - Other:
     - Returns a value
 - ### Storage_get
   - Syntax:
      ```
      rotur storage_get key: string 

      rotur:storage_get(key: string)
      ```
   - Usage:
gets key from storage
   - Other:
     - Returns a value
 - ### Storage_set
   - Syntax:
      ```
      rotur storage_set key: string value: string 

      rotur:storage_set(key: string, value: string)
      ```
   - Usage:
sets a key in storage
 - ### Storage_has
   - Syntax:
      ```
      rotur storage_has key: string 

      rotur:storage_has(key: string)
      ```
   - Usage:
checks if a key exists in storage
   - Other:
     - Returns a value
 - ### Storage_delete
   - Syntax:
      ```
      rotur storage_delete key: string 

      rotur:storage_delete(key: string)
      ```
   - Usage:
deletes a key in storage
 - ### Storage_keys
   - Syntax:
      ```
      rotur storage_keys  

      rotur:storage_keys()
      ```
   - Usage:
gets all the storage keys
   - Other:
     - Returns a value
 - ### Storage_values
   - Syntax:
      ```
      rotur storage_values  

      rotur:storage_values()
      ```
   - Usage:
gets all the storage values
   - Other:
     - Returns a value
 - ### Storage_clear
   - Syntax:
      ```
      rotur storage_clear  

      rotur:storage_clear()
      ```
   - Usage:
clears storage
 - ### Storage_usage
   - Syntax:
      ```
      rotur storage_usage  

      rotur:storage_usage()
      ```
   - Usage:
gets the current storage usage
   - Other:
     - Returns a value
 - ### Storage_limit
   - Syntax:
      ```
      rotur storage_limit  

      rotur:storage_limit()
      ```
   - Usage:
gets the current storage limit
   - Other:
     - Returns a value
 - ### Storage_remaining
   - Syntax:
      ```
      rotur storage_remaining  

      rotur:storage_remaining()
      ```
   - Usage:
gets the current storage remaining
   - Other:
     - Returns a value
## Packets
 - ### Send
   - Syntax:
      ```
      rotur send payload: string user: string from_port: string to_port: string 

      rotur:send(payload: string, user: string, from_port: string, to_port: string)
      ```
   - Usage:
send a packet
 - ### Get_packets
   - Syntax:
      ```
      rotur get_packets port: string 

      rotur:get_packets(port: string)
      ```
   - Usage:
gets all packets
   - Other:
     - Returns a value
 - ### Get_first_packet
   - Syntax:
      ```
      rotur get_first_packet port: string 

      rotur:get_first_packet(port: string)
      ```
   - Usage:
gets the first packet
   - Other:
     - Returns a value
 - ### Get_packet_amount
   - Syntax:
      ```
      rotur get_packet_amount port: string 

      rotur:get_packet_amount(port: string)
      ```
   - Usage:
gets the amount of packets on a port
   - Other:
     - Returns a value
 - ### Pop_packet
   - Syntax:
      ```
      rotur pop_packet port: string 

      rotur:pop_packet(port: string)
      ```
   - Usage:
pops the first packet of a port and returns it
   - Other:
     - Returns a value
 - ### Get_all_targets
   - Syntax:
      ```
      rotur get_all_targets  

      rotur:get_all_targets()
      ```
   - Usage:
gets all the open ports
   - Other:
     - Returns a value
 - ### Get_all_packets
   - Syntax:
      ```
      rotur get_all_packets  

      rotur:get_all_packets()
      ```
   - Usage:
gets all the packets as an array
   - Other:
     - Returns a value
 - ### Delete_packets_on
   - Syntax:
      ```
      rotur delete_packets_on port: string 

      rotur:delete_packets_on(port: string)
      ```
   - Usage:
deletes all the packets on a port
 - ### Delete_packets
   - Syntax:
      ```
      rotur delete_packets  

      rotur:delete_packets()
      ```
   - Usage:
deletes all the packets
## Users
 - ### Connected_users
   - Syntax:
      ```
      rotur connected_users  

      rotur:connected_users()
      ```
   - Usage:
gets a list of currently online users as an array
   - Other:
     - Returns a value
 - ### User_connected
   - Syntax:
      ```
      rotur user_connected user: string 

      rotur:user_connected(user: string)
      ```
   - Usage:
checks if a user is connected (username so e.g. `"flufi"`)
   - Other:
     - Returns a value
 - ### User_connected_on
   - Syntax:
      ```
      rotur user_connected_on user: string designation: string 

      rotur:user_connected_on(user: string, designation: string)
      ```
   - Usage:
checks if a user is connected (username and designation so e.g. `flufi` and `flf`)
   - Other:
     - Returns a value
 - ### Users_connected_on
   - Syntax:
      ```
      rotur users_connected_on designation: string 

      rotur:users_connected_on(designation: string)
      ```
   - Usage:
gets a list of users connnected on a designation as an array
   - Other:
     - Returns a value
 - ### User_ids_of
   - Syntax:
      ```
      rotur user_ids_of username: string 

      rotur:user_ids_of(username: string)
      ```
   - Usage:
gets the ids of a user currently connected
   - Other:
     - Returns a value
## Mail
 - ### Mail_send
   - Syntax:
      ```
      rotur mail_send subject: string message: string user: string 

      rotur:mail_send(subject: string, message: string, user: string)
      ```
   - Usage:
send a mail
   - Other:
     - Returns a value
 - ### Mail_get
   - Syntax:
      ```
      rotur mail_get  

      rotur:mail_get()
      ```
   - Usage:
gets a list of mail
   - Other:
     - Returns a value
 - ### Mail_get_index
   - Syntax:
      ```
      rotur mail_get_index index: number 

      rotur:mail_get_index(index: number)
      ```
   - Usage:
gets mail at index
   - Other:
     - Returns a value
 - ### Mail_delete_index
   - Syntax:
      ```
      rotur mail_delete_index index: number 

      rotur:mail_delete_index(index: number)
      ```
   - Usage:
deletes mail at an index
 - ### Mail_delete
   - Syntax:
      ```
      rotur mail_delete  

      rotur:mail_delete()
      ```
   - Usage:
deletes all mail
## Friends
 - ### Friends_get
   - Syntax:
      ```
      rotur friends_get  

      rotur:friends_get()
      ```
   - Usage:
gets a list of friends as an array
   - Other:
     - Returns a value
 - ### Friends_remove
   - Syntax:
      ```
      rotur friends_remove user: string 

      rotur:friends_remove(user: string)
      ```
   - Usage:
removes a friend
   - Other:
     - Returns a value
 - ### Friend_request_accept
   - Syntax:
      ```
      rotur friend_request_accept user: string 

      rotur:friend_request_accept(user: string)
      ```
   - Usage:
accepts a friend request
   - Other:
     - Returns a value
 - ### Friend_request_decline
   - Syntax:
      ```
      rotur friend_request_decline user: string 

      rotur:friend_request_decline(user: string)
      ```
   - Usage:
declines a friend request
   - Other:
     - Returns a value
 - ### Friend_request_send
   - Syntax:
      ```
      rotur friend_request_send user: string 

      rotur:friend_request_send(user: string)
      ```
   - Usage:
sends a friend request
 - ### Friend_status
   - Syntax:
      ```
      rotur friend_status user: string 

      rotur:friend_status(user: string)
      ```
   - Usage:
checks if a user is a friend or not ("Not Friend", "Friend")
   - Other:
     - Returns a value
 - ### Friend_count
   - Syntax:
      ```
      rotur friend_count  

      rotur:friend_count()
      ```
   - Usage:
gets the amount of friends
   - Other:
     - Returns a value
## Currency
 - ### Currency_balance
   - Syntax:
      ```
      rotur currency_balance  

      rotur:currency_balance()
      ```
   - Usage:
gets current balance
   - Other:
     - Returns a value
 - ### Currency_transfer
   - Syntax:
      ```
      rotur currency_transfer amount: number user: string 

      rotur:currency_transfer(amount: number, user: string)
      ```
   - Usage:
transfers credits to acc
   - Other:
     - Returns a value
 - ### Currency_transactions
   - Syntax:
      ```
      rotur currency_transactions  

      rotur:currency_transactions()
      ```
   - Usage:
gets a list of transactions
   - Other:
     - Returns a value
## Items
 - ### Item_all_owned
   - Syntax:
      ```
      rotur item_all_owned  

      rotur:item_all_owned()
      ```
   - Usage:
gets a list of uuids of the items you own
   - Other:
     - Returns a value
 - ### Item_data
   - Syntax:
      ```
      rotur item_data item: string 

      rotur:item_data(item: string)
      ```
   - Usage:
gets the data of an item (description)
   - Other:
     - Returns a value
 - ### Item_info
   - Syntax:
      ```
      rotur item_info item: string 

      rotur:item_info(item: string)
      ```
   - Usage:
gets the info of an item (json object)
   - Other:
     - Returns a value
 - ### Item_purchase
   - Syntax:
      ```
      rotur item_purchase item: string 

      rotur:item_purchase(item: string)
      ```
   - Usage:
purchases an item
   - Other:
     - Returns a value
 - ### Item_owned
   - Syntax:
      ```
      rotur item_owned item: string 

      rotur:item_owned(item: string)
      ```
   - Usage:
checks if you own an item
   - Other:
     - Returns a value
## Item
 - ### Itempage_get
   - Syntax:
      ```
      rotur itempage_get index: number 

      rotur:itempage_get(index: number)
      ```
   - Usage:
gets an item page at index
   - Other:
     - Returns a value
 - ### Itempage_list
   - Syntax:
      ```
      rotur itempage_list  

      rotur:itempage_list()
      ```
   - Usage:
gets the amount of item pages
   - Other:
     - Returns a value
## Items
 - ### Items_made_list
   - Syntax:
      ```
      rotur items_made_list  

      rotur:items_made_list()
      ```
   - Usage:
gets an array of item uuids you've made
   - Other:
     - Returns a value
 - ### Items_made_create
   - Syntax:
      ```
      rotur items_made_create name: string description: string price: number data: string transferable: bool 

      rotur:items_made_create(name: string, description: string, price: number, data: string, transferable: bool)
      ```
   - Usage:
creates an item
   - Other:
     - Returns a value
 - ### Items_made_update
   - Syntax:
      ```
      rotur items_made_update key: string value: string id: string 

      rotur:items_made_update(key: string, value: string, id: string)
      ```
   - Usage:
updates an item
   - Other:
     - Returns a value
 - ### Items_made_delete
   - Syntax:
      ```
      rotur items_made_delete id: string 

      rotur:items_made_delete(id: string)
      ```
   - Usage:
deletes an item
   - Other:
     - Returns a value
 - ### Items_made_set_purchasable
   - Syntax:
      ```
      rotur items_made_set_purchasable id: string value: bool 

      rotur:items_made_set_purchasable(id: string, value: bool)
      ```
   - Usage:
sets if an item is purchasable
   - Other:
     - Returns a value
