use scryfall;
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::async_runtime::block_on;

#[derive(Debug, Serialize, Deserialize, PartialEq)]
struct MyCard {
    quantity: u32,
    name: String,
    colors: Option<Vec<scryfall::card::Color>>,
    image_uris: Option<scryfall::card::ImageUris>,
}

#[tauri::command]
fn parse_cards(input: &str) -> String {
    let mut card_list: Vec<MyCard> = Vec::new();
    for line in input.lines() {
        if line.trim().is_empty() {
            continue;
        }

        let parts: Vec<&str> = line.trim().splitn(2, ' ').collect();

        let (quantity, name) = if let Ok(qty) = parts[0].parse::<u32>() {
            (qty, parts[1..].join(" "))
        } else {
            (1, parts.join(" "))
        };

        let card_details = block_on(fetch_card_details(&name)).expect("failed to fetch details");

        let card = MyCard {
            quantity,
            name,
            colors: card_details.colors,
            image_uris: card_details.image_uris,
        };
        card_list.push(card);
    }
    serde_json::to_string(&card_list).expect("Failed to serialize card list")
}

// fetches first card returned from scryfall search
async fn fetch_card_details(card_name: &str) -> Result<scryfall::Card, scryfall::Error> {
    scryfall::Card::named(&card_name).await
}

#[tauri::command]
fn parse_card_file(path: &str) -> String {
    let contents = fs::read_to_string(path).expect("error reading file");
    return parse_cards(&contents);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![parse_cards, parse_card_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
